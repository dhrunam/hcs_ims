import { Renderer2, Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  user_role: string = ''
  isHighCourtUser: boolean=false;

  constructor(private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {

    this.getUser();
    let script = this._renderer2.createElement('script');
    script.type = 'text/javascript';
    script.text = " function manageLeftMenu(){let btn = document.getElementById('btn');let sideBar = document.querySelector('.sidebar');btn.onclick=function(){sideBar.classList.toggle('closed')};let arrow = document.querySelectorAll('.arrow');for(var i=0;i<arrow.length;i++){arrow[i].addEventListener('click',(e)=>{let arrowParent = e.target.parentElement.parentElement;arrowParent.classList.toggle('showMenu')})}} manageLeftMenu();"
    this._renderer2.appendChild(this._document.body, script);

  }

  getUser() {
    let user = this.localStorageService.getUser();

    
    if (user.related_groups[0] != undefined) {
      this.user_role=user.related_groups[0].name;
      if (user.related_groups[0].name == 'hc-user') {
        this.isHighCourtUser = true
      }
      if (user.related_groups[0].name == 'dc-user') {
        this.isHighCourtUser = false
      }
      if (
        user.related_groups[0].name == 'admin'
      ) {
        this.isHighCourtUser = true
      }

    }
  }

}
