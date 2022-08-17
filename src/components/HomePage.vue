<template>
  <div class="HomePage container mt-3 mb-3"  dir = "rtl" align = "right">
    <div v-if="fileUploaded">
      <AnnotationsPage v-bind:json="json" v-bind:prolificSubmissionId="prolificSubmissionId"/>
    </div>
    <div v-else>
      <h1>כתיבת שאלות על פסקאות מוויקיפדיה</h1>
      <hr>
  <p>
  במשימה זו תקבלו פסקאות אקראיות שנלקחו מערכים בוויקיפדיה. לכל פסקה תתבקשו לנסח שני סוגים של שאלות הבנת הנקרא:
  <br>
  <li>
  5 שאלות שיש להן תשובה בפסקה.
אם אינכם מצליחים לנסח 5 שאלות, אפשר לנסח 4 שאלות, או 3 (מינימום), אבל השתדלו לנסח 5.
  </li>

  <li>2 שאלות <b>רלוונטיות</b> לפסקה, אך אין להן תשובה בפסקה (במקום לסמן תשובה נכונה יש לסמן מסיח שאינו התשובה הנכונה).<br>
     אם אינכם מצליחים לנסח 2 שאלות, נסחו לפחות שאלה אחת.
  </li>
  <br>
  את <b><u>השאלות</u></b> נסחו <b>במילים שלכם</b> ו<b>בשפה חופשית</b> ככל האפשר.
  <br>
  <b><u>התשובה</u></b> היא <b>מילה או מחרוזת מילים מתוך הפסקה</b>, ואותה תסמנו על גבי הפסקה באמצעות העכבר.
  <br>
  לכל שאלה בעלת מענה יש לסמן את התשובה הנכונה, אך <u><b>גם לכל שאלה חסרת מענה יש לסמן תשובה מוגדרת</b></u> - מעין מסיח שנראה כמו תשובה מתקבלת על הדעת, אך אינו תשובה נכונה.
  <br>
  משך המשימה הוא <b><u>שעה.</u></b>
  <br>
  <h5 align = "right">
  טרם תחילת המשימה יש לקרוא בקפידה את 
  <b><a href="https://drive.google.com/file/d/1iJQBbhOP0YhUi3G9JDf82Sy9bflaHDLd/view" target="_blank" v-on:click="guideClicked" v-on:auxclick="guideClicked"
   > ההנחיות</a></b>.
    </h5> 
    (מומלץ להשאיר את עמוד ההנחיות פתוח בחלון או בטאב נפרד בעת ביצוע המשימה.)
    <br>
    שימו לב! טווח התשובה שתסמנו צריך לעמוד בסטנדרטים מסוימים.
    <br>
     <b>מבלי לקרוא את ההנחיות לא ניתן לבצע את המשימה.</b> 
    <br>
     שאלות ותשובות שאינן עומדות בקריטריונים בסיסיים הן פסולות.
    <br>
  עבור כל פסקה הקדישו כ-9-10 דקות לנסח כ-7 שאלות (סה״כ: כ-42 שאלות לאורך המשימה).
      <!-- <json-viewer :value="jsonData" :expand-depth="10" copyable></json-viewer> -->
      <!-- <br>
      <div class="uploadBar" align = "left">
        <b-form-file
          v-model="file"
          :state="Boolean(file)"
          placeholder="Upload a JSON file here"
          accept=".json"
        ></b-form-file>
      </div>
      <br>
      <b-button :size="''" :variant="'primary'" v-on:click="readFileFromUpload()">Upload</b-button>
      <br><br> -->
      <!-- <h5>אם אין לכם קובץ להעלות בחרו באופציה הבאה:</h5> -->
      <br>
      <!-- <h5>הדביקו כאן את ה-Prolific ID שלכם:</h5><input v-model="prolificID" placeholder="Prolific ID"  align="left"/> -->
      <br>
      <p style="color:red;">{{ errors }}</p>
      <br>
      <b-button :size="''" :variant="'primary'" v-on:click="getRandomFile()">בואו נתחיל</b-button>
    </div>
  </div>
</template>

<script>
import AnnotationsPage from "./AnnotationsPage.vue";
import { dataService } from "../services/data";
import firebase from '../services/firebase'

export default {
  name: "HomePage",
  data: function() {
    return {
      jsonData: {
        data: [
          {
            title: "Question answering",
            paragraphs: [
              {
                context:
                  "Question answering (QA) is a computer science discipline within the fields of information retrieval and natural language processing (NLP), which is concerned with building systems that automatically answer questions posed by humans in a natural language.",
                qas: []
              },
              {
                context:
                  "A QA implementation, usually a computer program, may construct its answers by querying a structured database of knowledge or information, usually a knowledge base. More commonly, QA systems can pull answers from an unstructured collection of natural language documents.",
                qas: []
              }
            ]
          },
          {
            title: "Natural language processing",
            paragraphs: "[...]"
          }
        ]
      },
      fileUploaded: false,
      file: null,
      json: null,
      jsonID: null,
      errors: "",    
      prolificID: this.getParameterByName("PROLIFIC_PID"),
      studyID : this.getParameterByName("STUDY_ID"),
      guide:null,
      prolificSubmissionId:"",
      avoid:[]
    };
  },
    beforeMount(){
    firebase.firestore().collection("annotations").onSnapshot((querySnapshot) => {
      this.avoid = [];
      querySnapshot.forEach((doc) => {
        this.avoid.push(doc.data().filename.substring(15,21));
      });
    });

 },
 created() {
    const studies= {
      "geektime":"geektime"       
    }
    const study = (this.studyID in studies)? studies[this.studyID] : "default";
    const studyDef = require(`../studies/${study}.json`);
    this.prolificSubmissionId= studyDef.prolificSubmissionId;
    // eslint-disable-next-line
    console.log(`Using study: ${study}, def:`, studyDef); 
    if (studyDef.type === "limits") {
      dataService.initializeByLimits(studyDef.min, studyDef.max);
    } else if (studyDef.type === "ids") {
      dataService.initializeByIds(studyDef.ids);
    } else {
      // eslint-disable-next-line
      console.warn(`Invalid study def type: "${studyDef.type}", using default limits`);
      dataService.initializeByLimits();
}
 
 },
  methods: {
    readFileFromUpload: function() {
      var reader = new FileReader();
      reader.onload = function(event) {
        this.json = JSON.parse(event.target.result);
        this.fileUploaded = true;
        
      }.bind(this);
      reader.readAsText(this.file);
    },
    guideClicked: function () {
      this.guide = "pass"
    },
    checkID: function(){
      // eslint-disable-next-line no-console
      // console.log(this)
      if(this.prolificID == ""){
        this.errors = "שדה חובה";
        return false;
      }
      else if(this.guide !== "pass" && this.prolificID !== "Roi"){
          this.errors = "חובה לקרוא את ההנחיות לפני שמתחילים";
        return false
      }
      else{
          this.errors = "";
          return true;
      }
    },
    getRandomFile: async function () {// When pressing the button!!!
      if (!this.checkID()) {
        return;
      }
      this.jsonID = dataService.getNextId();
      const paddedID = this.checkFile(dataService.pad(this.jsonID, 6));
      this.json = require(`../json_resources/geekPost_${paddedID}.json`);
      this.json.jsonID = this.jsonID;
      this.json.prolificID = this.prolificID;
      this.json.studyID = this.studyID;
      this.fileUploaded = true;
    },
    getParameterByName: function (name) {
      let queryDict = {};
      location.search.substr(1).split("&").forEach(function (item) {
        queryDict[item.split("=")[0]] = item.split("=")[1]
      });
      if (name in queryDict) {
        return queryDict[name];
      }
      return "";
    },
    state: function (jsonID) {
      var intID = parseInt(jsonID)
      return intID > 0 && intID < 1200;
    },
    checkFile: function (paddedID) {
      // eslint-disable-next-line no-console
      // console.log(paddedID)
      // eslint-disable-next-line no-console
      // console.log(this.avoid)
      let i = 0;
      if(this.avoid.includes(paddedID) && i<100)
      {
        paddedID =  dataService.pad(dataService.getNextId() , 6);
        i++;
        // eslint-disable-next-line no-console
        // console.log(this.avoid)
      }
      return paddedID
    }
    
  },
  components: {
    AnnotationsPage
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.uploadBar {
  max-width: 300px;
}
</style>
