import { Component } from '@angular/core';
import * as moment from 'moment';
import { ApiService } from './api.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'filter-data';
  myDateValue!: Date;
  toDate!: Date;
  duplicateArray!: Array<any>;
   d = new Date();
  public array:any;

  constructor( private apiService:ApiService){
     apiService.getData().subscribe(res=>{
        this.array = res;
        this.array = [
          this.array['england-and-wales'],
          this.array['scotland'],
          this.array['northern-ireland']
        ]
        this.duplicateArray = this.array;
        console.log(this.duplicateArray);
      })
  }
  ngOnInit() {
    this.myDateValue = new Date('12-08-2019');
   
    console.log(this.array);
  }

  getTimeStamp(dateString: string) {
    const reverse = new Date(dateString.split('-').reverse().join('-'));
    return reverse.getTime();
  }
  
  yesterDaysData(){	
    const today = new Date();
    const yesterday = new Date(today);
    
    yesterday.setDate(yesterday.getDate() - 1);
    this.myDateValue=new Date(yesterday);
    this.toDate = new Date(yesterday);
    this.filterDate();
  }

  lastWeekData(){
    var d = new Date();

    // set to Monday of this week
    d.setDate(d.getDate() - (d.getDay() + 6) % 7);
    
    // set to previous Monday
    d.setDate(d.getDate() - 7);
    
    // create new date of day before
    var lastMonday = new Date(d.getFullYear(), d.getMonth(), d.getDate() );
    var lastSaturday = new Date(d.getFullYear(), d.getMonth(), d.getDate()+6 );
    this.myDateValue=lastMonday;
    this.toDate = lastSaturday;
     this.filterDate();
  }

  lastMonthData(){
    var now = new Date();
    var prevMonthLastDate = new Date(now.getFullYear(), now.getMonth(), 0);
    var prevMonthFirstDate = new Date(now.getFullYear() - (now.getMonth() > 0 ? 0 : 1), (now.getMonth() - 1 + 12) % 12, 1);
    this.myDateValue=new Date(this.formatDate(prevMonthFirstDate));
    this.toDate = new Date(this.formatDate(prevMonthLastDate))
     this.filterDate();
  }

  formatDateComponent(dateComponent: number){
    return (dateComponent < 10 ? '0' : '') + dateComponent;
  }

  formatDate(date: Date){
    return  this.formatDateComponent(date.getMonth() + 1)  + '-' +this.formatDateComponent(date.getDate())+'-' + date.getFullYear();
  }


  filterDate() {
    let fromdate = moment(this.myDateValue).format('DD-MM-YYYY');
   let selectedMembers: any []=[];
    let todate = moment(this.toDate).format('DD-MM-YYYY');
    console.log("Form : "+fromdate+" To : "+todate);
    if (this.myDateValue && this.toDate) {
      
      for (let i = 0; i < this.array.length; i++) {
        let division=this.array[i].division;
         let events = this.array[i].events.filter((m:any) => {
          return (
            this.getTimeStamp(m.date) >=
              this.getTimeStamp(fromdate) &&
              this.getTimeStamp(m.date) <=
              this.getTimeStamp(todate)
          );
        });
        selectedMembers.push({"division" : division, "events" : events});
      }
      
      this.duplicateArray = selectedMembers;
    } else {
      this.duplicateArray = this.array;
    }

    console.log(this.duplicateArray); // the result objects
  }

}
