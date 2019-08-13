import { Component, OnInit } from '@angular/core';
import { LoopBackConfig, QuestionApi, Question, Conversation, ConversationApi } from './utils/api';
import { environment } from 'src/environments/environment';
import * as uuid from 'uuid';
declare let $: any;
import _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  questions: Question[];
  questionsList: Question[];
  conversation: Conversation;
  endTimeout: any;
  end: false;

  constructor(private questionApi: QuestionApi, private conversationApi: ConversationApi) {
    LoopBackConfig.setBaseURL(environment.apiUrl);
    LoopBackConfig.setApiVersion('api');

    this.conversation = new Conversation();
    this.conversation.id = uuid.v4();
    this.conversation.history = [];
    this.conversation.createdAt = <any>moment().toDate().toISOString();
  }

  ngOnInit() {
    this.questionApi.find({ where: { questionId: null } }).subscribe((questions: Question[]) => {
      this.questions = questions;
      this.questionsList = questions;
      this.conversation.history.push({ content: "Bonjour, je suis Chatbot, comment puis-je vous aider ?", bot: true, createdAt: <any>moment().toDate().toISOString() });
    });

    window.onbeforeunload = (e) => {
      this.sendData();
    };
  }

  selectQuestion(question: Question) {
    this.restartEndTimer();

    if (question.answer) {
      //push user question
      this.conversation.history.push({ content: question.title, bot: false, createdAt: <any>moment().toDate().toISOString() });

      //push bot answer
      this.conversation.history.push({ content: question.answer, bot: true, createdAt: <any>moment().toDate().toISOString() });

      //wait for angular to create DOM and scoll to bottom of it
      setTimeout(() => {
        document.getElementsByClassName("chat-content")[0].scrollTop = document.getElementsByClassName("chat-content")[0].scrollHeight;
      }, 1)
    }

    if (question.questions.length > 0) this.questions = question.questions;

    if (question.questions.length == 0) this.questions = this.questionsList;
  }

  sendData() {
    this.conversationApi.upsert(this.conversation).subscribe((conversation) => {
      $("#endModal").modal('hide');
      $("#byeModal").modal('show');
    })
  }

  restartEndTimer() {
    clearTimeout(this.endTimeout);
    this.endTimeout = setTimeout(() => {
      $("#endModal").modal('show');
    }, 20000)
  }


}
