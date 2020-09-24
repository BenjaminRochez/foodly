<template>
  <div>
    <p>{{weekdays}}</p>
    <div v-for="(weekday, index) in weekdays" v-bind:key="index">
      <h2>{{ weekday.date }}</h2>
      <draggable group="meals" v-bind:key="forceKey">
        <div v-for="(meal, index) in weekday.meals" v-bind:key="index">
          {{ meal }}
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import db from "@/firebase/init";
import firebase from "firebase";
import _ from "lodash";
export default {
  name: "Weekly",
  components: {
    draggable,
  },
  data() {
    return {
      weekdays: [],
      meals: [],
      forceKey: 0
    };
  },
  methods: {
    getMeal: function () {
      for (var i = 0; i < 7; i++) {
        let meals = _.pickBy(
          this.meals,
          (o) => o.date === this.weekdays[i].time
        );
        this.weekdays[i].meals = meals;
        if(i === 6){
            this.forceKey += 1;
        }
      }
    },
    getWeekly: function () {
      for (var i = 0; i < 7; i++) {
        let date = this.weekdays[i].time;
        let ref = db.collection("weekly").where("date", "==", date);
        var j = 0;
        ref.get().then((snap) => {
          j++;
          if (j === 7) {
            this.getMeal();
          }
          snap.forEach((element) => {
            this.meals.push(element.data());
          });
        });
      }
    },
  },
  created() {
    var curr = new Date(); // get current date
    var first = curr.getDate() - curr.getDay() + 1; // First day is the  day of the month - the day of the week
    //var last = first + 6; // last day is the first day + 6
    //var firstday = new Date(curr.setDate(first)).toUTCString();
    //var lastday = new Date(curr.setDate(curr.getDate()+6)).toUTCString();

    for (var i = 0; i < 8; i++) {
      if (i < 7) {
        var currDay = first + i;
        var fullday = new Date(curr.setDate(currDay)).toUTCString();
        var month = new Date(curr.setDate(currDay)).getMonth() + 1;
        var year = new Date(curr.setDate(currDay)).getFullYear();
        var day = currDay + "/" + month + "/" + year;
        var time = currDay + "" + month + "" + year;
        var weekday = {
          date: day,
          time: time,
        };
        this.weekdays.push(weekday);
      } else {
        this.getWeekly();
      }
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.uid = user.uid;
      }
    });
  },
  computed: {},
};
</script>

<style>
.draggable {
  min-height: 50px;
}
</style>