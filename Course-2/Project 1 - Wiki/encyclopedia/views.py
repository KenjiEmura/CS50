from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from markdown2 import Markdown
from random import randint
from django import forms
from . import util


# Forms ------------------------------------------------------------------------------------

class NewSearchForm(forms.Form):
    q = forms.CharField( label = "Search Encyclopedia", widget = forms.TextInput( attrs = {'class':'input-text'} ) )

class NewEntry(forms.Form):
    title = forms.CharField(
        label = "New entry title",
        widget = forms.TextInput( attrs = {'class':'input-text entry-title'} )
        )
    entry_content = forms.CharField(
        label = "Enter the content of the new entry:",
        widget = forms.Textarea( attrs = {'class':'input-text entry-content'} )
        )

class EditForm(forms.Form):
    edited_content = forms.CharField(
        label = "Edit the content of the entry:",
        widget = forms.Textarea( attrs = {'class':'input-text entry-content'} )
        )


# Routes -------------------------------------------------------------------------------------

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries(),
        "search_form": NewSearchForm()
    })

def entry(request, entry_title):
    markdown = Markdown()
    entry = util.get_entry(entry_title)
    if entry:
        return render(request, "encyclopedia/entry.html", {
            "entry_title": entry_title,
            "entry": markdown.convert(f"{entry}"),
            "raw_entry": entry.split("\n", 1)[1],
            "search_form": NewSearchForm()
        })
    else:
        return render(request, "encyclopedia/404.html", {
            "entry_title": entry_title,
            "search_form": NewSearchForm()
        })

def query(request):
    if request.method == "GET":
        form = NewSearchForm(request.GET)
        if form.is_valid():
            markdown = Markdown()
            query = form.cleaned_data["q"]
            entry = util.get_entry( query )
            list_of_entries = util.list_entries()
            if entry:
                return render(request, "encyclopedia/entry.html", {
                    "query": query,
                    "entry": markdown.convert(f"{entry}"),
                    "search_form": NewSearchForm()
                })
            else:
                search_results = []
                for entry in list_of_entries:
                    if query.lower() in entry.lower():
                        search_results.append(entry)
                return render(request, "encyclopedia/query.html", {
                    "query": query,
                    "entry": markdown.convert(f"{entry}"),
                    "search_form": NewSearchForm(),
                    "search_results": search_results
                })

def new_entry(request):
    if request.method == "GET":
        return render(request, "encyclopedia/new-entry.html", {
            "search_form": NewSearchForm(),
            "new_entry": NewEntry()
        })
    elif request.method == "POST":
        new_entry = NewEntry(request.POST)
        if new_entry.is_valid():
            new_entry_title = new_entry.cleaned_data["title"]
            new_entry_content = "# " + new_entry_title + "\n\n" + new_entry.cleaned_data["entry_content"]
            entry_already_exists = util.get_entry(new_entry_title)
            if not entry_already_exists:
                markdown = Markdown()
                util.save_entry( new_entry_title, new_entry_content)
                return HttpResponseRedirect( reverse( "encyclopedia:entry", args = [new_entry_title] ) )
            else:
                return render(request, "encyclopedia/new-entry.html", {
                    "search_form": NewSearchForm(),
                    "new_entry": new_entry,
                    "title": new_entry_title,
                    "exists": entry_already_exists
                })

def edit(request):
    if request.method == "GET":
        data = request.GET
        title = data["entry_title"]
        entry = util.get_entry(title)
        parsed_entry = " ".join(entry.split())
        edit_form = EditForm( initial={'edited_content': entry.split("\n", 2)[2]} )
        return render(request, "encyclopedia/edit.html", {
            "title": title,
            "edit_form": edit_form,
            "search_form": NewSearchForm()
        })
    else:
        data = request.POST
        title = data["entry_title"]
        content = "# " + title + "\n\n" + data["edited_content"]
        util.save_entry(title, content)
        return HttpResponseRedirect( reverse( "encyclopedia:entry", args = [title] ) )

def random(request):
    entries = util.list_entries()
    max_index = len(util.list_entries()) - 1
    random_number = randint(0, max_index)
    return HttpResponseRedirect( reverse( "encyclopedia:entry", args = [ entries[random_number] ] ) )
    # return render(request, "encyclopedia/test.html", {
    #     "max_index": max_index,
    #     "random_number": random_number,
    #     "random_entry": entries[random_number],
    #     "entries": entries,
    #     "search_form": NewSearchForm()
    # })