
from multiprocessing import context
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect

# Create your views here.

def register_view(request):
    print("test.. register")
    form=UserCreationForm(request.POST or None)
    
    if form.is_valid():
        user_object=form.save()
        return redirect('/accounts/login')
    
    context={"form":form}
    return render(request,'accounts/register.html',context)


def login_view(request):
    if request.method=="POST":
        username = request.POST.get('username')
        password = request.POST.get('password')
        # print(username, password)
        user =authenticate(request, username=username, password=password)
        if user is None:
            context={"error": "Invalide username or password"}
            return render(request, "accounts/login.html",context=context)
        
        login(request,user)
        return redirect('/admin')
    return render(request, "accounts/login.html",{})


def logout_view(request):
    print(request)
    if request.method=="POST":
        logout(request)
        return redirect("/accounts/login/")

    return render(request, "accounts/logout.html",{})

# def register_view(request):
#     return render(request, "accounts/register.html",{})






