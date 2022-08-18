<template>
  <div class="AnnotationsPage container mt-3">
    <div>
      <b-navbar sticky toggleable="lg" class="pl-0">
        <b-navbar-brand>cdQA-annotator - Welcome User Number {{this.json.prolificID}}</b-navbar-brand>
<!-- 
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav> -->
          <!-- Right aligned nav items -->
          <!-- <b-navbar-nav class="ml-auto">
            <b-nav-item>
              <svg-progress-bar :value="data_number / json.data.length * 100" :options="options"></svg-progress-bar>
            </b-nav-item> -->
            <b-nav-form>
              <!-- <vue-bootstrap-typeahead
                size="sm"
                v-model="query"
                :data="autocomplete"
                placeholder="Search a document..."
                @hit="data_number = autocomplete.indexOf($event) + 1; context_number = 1"
              /> -->
            </b-nav-form>
              <!-- <p>Message is: {{ message }}</p> -->
            <!-- <b-nav-item right>
              <b-button
                :size="'sm'"
                :variant="'primary'"
                v-on:click="delete_empty_document()"
                v-download-data="valid_json"
                v-download-data:type="'json'"
                v-download-data:filename="getName()"
              >Download</b-button>
            </b-nav-item>
          </b-navbar-nav> -->
        <!-- </b-collapse> -->
      </b-navbar>
    </div>       
    <br>
    <div v-if="this.toEnd == false">
    <!-- <h2 dir="rtl" class="text-right">{{ json.data[data_number - 1].title }}</h2> -->
      <h2>פסקה מספר {{ dataService.pad(this.json.jsonID, 6)}}</h2>
      <!-- <span
        class="text-muted" dir="rtl" 
      >פסקה {{ context_number }} מתוך {{ json.data[data_number - 1].paragraphs.length }} | מסמך {{ data_number }} מתוך {{ json.data.length }}</span> -->
      <br>
      <div class="demo">
      <br>
      <p ref="paragraph" v-selection.fix="{getSelection:getSelection}">{{ paragraph_context }}</p>
      <div><b>בחרו סוג שאלה שברצונכם להוסיף:</b></div>
        <input type="radio" id="one" value=true v-model="withAnswer" v-on:change='managePlaceHolders()' :style ="{'accent-color': 'green'}"
        />
        <label for="one" :style="{ 'background-color': '#dbfcd7' , 'opacity': 1 ,  'color': 'black' }">שאלה ש<b>יש</b> לה מענה בפסקה</label>
        <br>
        <input type="radio" id="two" value=false v-model="withAnswer" v-on:change='managePlaceHolders()' :style="{'accent-color': 'red'}" />
        <label for="two" :style="{ 'background-color': '#f7dcdc' , 'opacity': 1 ,  'color': 'black' }">שאלה ש<b>אין</b> לה מענה בפסקה</label>
        <br>
        <br>
      </div>
      <br>
      <b-form-input v-model="question" :placeholder='this.questionPH' :style="{ 'background-color': borderColor , 'opacity': 1 ,  'color': 'black' }"  type="text"></b-form-input>
      <br>

      <b-form-input v-model="answer" :placeholder='this.answerPH' :style="{ 'background-color': borderColor , 'opacity': 1 , 'color': 'black'}" type="text"></b-form-input>
      <br>
      <b-button :size="''" :variant="buttonCss" v-on:click="addAnnotation()">הוספת שאלה ותשובה</b-button> 
      <br>
      <p style="color:red;">{{ errors }}</p>
      <br>
      <br>

      <b-table striped hover :items="items" :fields="fields" >
        <template slot="עריכה" slot-scope="row">
          <b-button :size="''" :variant="'warning'" @click.stop="editAnnotation(row.index)">Edit</b-button>
        </template>
        <template slot="מחיקה" slot-scope="row">
          <b-button :size="''" :variant="'danger'" @click.stop="deleteAnnotation(row.index)">Delete</b-button>
        </template>
      </b-table>
      <br>
      <div v-if="data_number > 1 && context_number == 1">
        <b-button
          :size="''"
          :variant="'outline-primary'"
          v-on:click="saveJSON('end')"
        >סיימתי</b-button>
         או 
        <b-button :size="''" :variant="'outline-primary'" v-on:click="getAnotherFile()">לפסקה הבאה</b-button>
      </div>
      <div v-else-if="context_number < json.data[data_number - 1].paragraphs.length">
        <b-button
          :size="''"
          :variant="'outline-primary'"
          v-on:click="saveJSON('end')"
        >סיימתי</b-button>
         או 
        <b-button :size="''" :variant="'outline-primary'" v-on:click="getAnotherFile()">לפסקה הבאה</b-button>
      </div>
      <div v-else>
        <b-button
          :size="''"
          :variant="'outline-primary'"
          v-on:click="saveJSON('end')"
        >סיימתי</b-button> 
        או 
        <b-button
          :size="''"
          :variant="'outline-primary'"
          v-on:click="getAnotherFile()"
        >לפסקה הבאה</b-button>
      </div>
      <br>
      <br>
    </div>
    <div v-else>
  <h3>תודה רבה על ההשתתפות!
    <img
          src="../assets/ablobmaracas.gif"
          height="30"
          width="30"
          alt = "כל הכבוד!"
      >
  </h3>
<!-- <h5>זהו קוד סיום המשימה: {קוד יופיע פה}</h5>
<h5>העתיקו אותו כדי לדווח ב-Prolific שסיימתם את המשימה</h5> -->
     <br>
      <b-button
          :size="''"
          :variant="'primary'"
          :href="prolificCompleteUrl"
      >בחזרה לפרוליפיק
      </b-button>
      <br>
      <br>
      <!-- <b-button
          :size="''"
          :variant="'primary'"
          v-on:click="getRandomFile()"
      >תנו לי עוד אחד
      </b-button> -->
    </div>
  </div>
</template>

<script>
import firebase from '../services/firebase'
import { dataService } from "../services/data"

const db = firebase.firestore()
const annotations = db.collection('annotations')
const enters = db.collection('enters')
const ends = db.collection('ends')
const d = new Date();

function JSClock() {
  const time = new Date();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();
  let temp = time.getDate()+'_'+(time.getMonth()+1)+'_'+time.getFullYear()+'_'+hour+'_';
  temp += ((minute < 10) ? '0' : '') + minute +'_';
  temp += ((second < 10) ? '0' : '') + second;
  return temp;
}

export const addEnterance = tag => {
    return enters.add(tag)
}
export const addEnds = tag => {
    return ends.add(tag)
}
export const addAnnotationToDB = tag => {
    return annotations.add(tag)
}
const uuidv4 = require('uuid/v4');

export default {
  name: "AnnotationsPage",
  props: [ "json", "prolificSubmissionId" ],
  data: function() {
    return {
      data_number: 1,
      context_number: 1,
      question: "",
      answer: "",
      fields: ["שאלות", "תשובות","מחיקה" ,"עריכה" , "יש תשובה בטקסט"],
      query: "",
      message: "",
      errors: "",
      textSelected: false,
      toEnd: false,
      withAnswer:true,
      questionPH:"הקלידו שאלה שיש לה מענה בפסקה...",
      answerPH:"סמנו תשובה מתוך הפסקה",
      borderColor:"#dbfcd7",
      dataService,
      testProlificID: "Roi",
      avoid:[]
    };
  },
  methods: {
    addAnnotation: function() {
      if(this.checkAnswers() == false) return
      var paragraph_container = this.json.data[this.data_number - 1].paragraphs[
        this.context_number - 1
      ];
      var qa = {
        question: this.question,
        id: uuidv4(),
        answers: [{ answer_start: this.answer_start, text: this.answer ,withAnswer:this.withAnswer }]
      };
      paragraph_container.qas.push(qa);
      this.question = "";
      this.answer = "";
      this.textSelected = false;
    },
    deleteAnnotation: function(row_index) {
      var paragraph_container = this.json.data[this.data_number - 1].paragraphs[
        this.context_number - 1
      ];
      paragraph_container.qas.splice(row_index, 1);
    },
    editAnnotation: function(row_index){
      var paragraph_container = this.json.data[this.data_number - 1].paragraphs[
        this.context_number - 1
      ];
      // eslint-disable-next-line no-console
      // console.log(paragraph_container.qas[row_index])
      // eslint-disable-next-line no-console
      // console.log(row_index)
      this.question = paragraph_container.qas[row_index].question;
      this.answer = paragraph_container.qas[row_index].answers[0].text;
      paragraph_container.qas.splice(row_index, 1);
    },
    getSelection: function(fixStr) {
      this.answer = fixStr;
      this.textSelected = true;
    },
    delete_paragraph: function() {
      var paragraph_container = this.json.data[this.data_number - 1].paragraphs;
      paragraph_container.splice([this.context_number - 1], 1);
    },
    delete_empty_document: function() {
      for (var i in this.json.data) {
        if (this.json.data[i].paragraphs.length == 0) {
          this.json.data.splice(i, 1);
        }
      }
    },
    endStamp:function(){
      const data = {
        ended:d.toString(),
        prolificID: this.json.prolificID,
        studyID: this.json.studyID
      }
      const docName = `${this.json.prolificID}_${this.json.studyID}_${JSClock()}`;
      if (this.json.prolificID === this.testProlificID) {
        // eslint-disable-next-line
        console.log("testing endStamp", { docName, data }); 
      } else {
        db.collection("ends").doc(docName).set(data);
      }
    },
    checkAnswers: function(){
      // eslint-disable-next-line no-console
      // console.log(this)
      if(this.question == "" ||  this.questionPH == this.question){
        this.errors = "יש להקליד שאלה";
        return false;  
      }else if(this.answer_start == -1){
          this.errors = "אין להקליד בשדה זה, יש לסמן תשובה מתוך הפסקה";
          return false;
      }
      else if(this.answer == "" ||  this.answerPH == this.answer){
          this.errors = "שדה תשובה ריק, יש לסמן תשובה מתוך הפסקה";
          return false;
      }
      else{
          this.errors = "";
          return true;
      }
    },
    saveJSON: async function (type) {
      if(type == "end")
      {
        this.toEnd = true;
        this.endStamp();
      }
      if(this.json.data[this.data_number - 1].paragraphs[this.context_number - 1].qas.length == 0) return;//if page is empty do not save
      var json1 = JSON.stringify(this.json).replace(/[\u007F-\uFFFF]/g, function(
        chr
      ) {
        return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
      });
      let tosend = {
        'json_data': json1,
        'prolificID': this.json.prolificID,
        'studyID':this.json.studyID,
        'filename': `geekPost_${dataService.pad(this.json.jsonID, 6)}_Tagged.json`,
        'timeStamp': d.toString(),
      }
      let docName = `${this.json.prolificID}_${this.json.studyID}_${dataService.pad(this.json.jsonID, 6)}_${JSClock()}`;
      if (this.json.prolificID === this.testProlificID) {
        // eslint-disable-next-line
        console.log("testing saveJSON", { docName, doc: tosend }); 
      } else {
        db.collection("annotations").doc(docName).set(tosend);
        // await addAnnotationToDB(tosend);
      }
    },
    getAnotherFile: async function () {
      let pro = this.json.prolificID;
      let studID = this.json.studyID;
      this.saveJSON("continue");
      this.jsonID = dataService.getNextId(true);

      const paddedID = this.checkFile(dataService.pad(this.jsonID, 6));
      this.json = require(`../json_resources/geekPost_${paddedID}.json`);
      this.json.jsonID = this.jsonID;
      this.json.prolificID = pro;
      this.json.studyID = studID;
      this.data_number = 1;
      this.answer = "";
      this.question = "";
      },
    managePlaceHolders: function(){

      this.questionPH = this.withAnswer == "true" ? "הקלידו שאלה שיש לה מענה בפסקה...": "הקלידו שאלה שאין לה מענה בפסקה...";//הקלידו שאלה ש<b>אין</b> לה מענה בפסקה...
      this.answerPH = this.withAnswer == "true" ? "סמנו תשובה מתוך הפסקה" :"סמנו תשובה מתקבלת על הדעת מתוך הפסקה";
      this.borderColor = this.withAnswer == "true" ? "#dbfcd7" :"#f7dcdc";
    },
    getName: function(){
      let tmpJsonID = this.json.jsonID;
      // delete this.json.jsonID;
      return "annotated_data_" + tmpJsonID + ".json";
    },
    checkFile: function (paddedID) {
      let i = 0;
      if(this.avoid.includes(paddedID) && i<100)
      {
        paddedID =  dataService.pad(dataService.getNextId() , 6);
        i++;
      }
      return paddedID
    }
  },
  beforeMount(){
    const data = {
      started:d.toString(),
      prolificID: this.json.prolificID,
      studyID: this.json.studyID
    }
    firebase.firestore().collection("annotations").onSnapshot((querySnapshot) => {
      this.avoid = [];
      querySnapshot.forEach((doc) => {
        this.avoid.push(doc.data().filename.substring(9,15));
      });
    });
    const docName = `${this.json.prolificID}_${this.json.studyID}_${JSClock()}`;
    if (this.json.prolificID === this.testProlificID) {
      // eslint-disable-next-line
      // console.log("testing beforeMount", { docName, data });
      // eslint-disable-next-line
      console.log(this.avoid);  
    } else {
      db.collection("enters").doc(docName).set(data)
    }
 },
  mounted() {
    this.$ga.page('/AnnotationsPage');
  },
  computed: {
    valid_json: function() {
      var json = JSON.stringify(this.json).replace(/[\u007F-\uFFFF]/g, function(
        chr
      ) {
        return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
      });
      return json;
    },
    autocomplete: function() {
      var idx = [];
      for (var i = 0; i < this.json.data.length; i++) {
        idx.push(this.json.data[i].title);
      }
      return idx;
    },
    buttonCss: function() {
      return this.withAnswer== "false"? 'danger' : 'success'
    },
    items: function() {
      var paragraph_container = this.json.data[this.data_number - 1].paragraphs[
        this.context_number - 1
      ];
      let color = "";
      var items = [];
      for (var i = 0; i < paragraph_container.qas.length; i++) {
        if(paragraph_container.qas[i].answers[0].withAnswer== true || paragraph_container.qas[i].answers[0].withAnswer== "true")
            color = "success";
        else
             color = "danger";
        var item = {
          // fields: ["שאלות", "תשובות", "עריכה" , "יש-תשובה"]
          שאלות: paragraph_container.qas[i].question,
          תשובות: paragraph_container.qas[i].answers[0].text,
          'יש תשובה בטקסט': paragraph_container.qas[i].answers[0].withAnswer,
          _rowVariant: color
        };
        items.push(item);
      }
      return items;
    },
    paragraph_context: function() {
      return this.json.data[this.data_number - 1].paragraphs[
        this.context_number - 1
      ].context;
    },
    answer_start: function() {
      return this.paragraph_context.indexOf(this.answer);
    },
    options() {
      return {
        radius: 15,
        circleLineCap: "round",
        varyStrokeArray: [1, 2],
        pathColors: ["lightgrey", "rgb(40, 167, 69)"],
        text: function(value) {
          return (
            this.htmlifyNumber(value) + '<span style="font-size: 1em;">%</span>'
          );
        },
        textColor: "black"
      };
    },
    prolificCompleteUrl() {
      return `https://app.prolific.co/submissions/complete?cc=${this.prolificSubmissionId}`;
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  #one{
     background-color: #689f38;
    border-color: #689f38;
  }
</style>


