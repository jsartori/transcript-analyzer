import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import AgentFacade from 'src/app/core/facades/agent.facade';
import CallFacade from 'src/app/core/facades/call.facade';
import Agent from 'src/app/core/models/agent';
import Transcript from 'src/app/core/models/transcript.model';

import TemplateService from 'src/app/core/services/template.service';

@Component({
  selector:        'app-analyzer',
  templateUrl:     './analyzer.component.html',
  styleUrls:       ['./analyzer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class AnalyzerComponent implements OnInit, AfterViewInit {
  @ViewChild('subHeader')
  private subHeader?: TemplateRef<any>;
  public dataSource: any[]    = [];
  public dataSourceRep: any[] = [];
  public activeAgent: Agent = new Agent();
  public activeTranscript: Transcript = new Transcript();
  public matchingPercentage = 0;
  public matchingScriptPercentage = 0;
  public coveredScriptPercentage = 0;

  constructor(
    public agents: AgentFacade,
    public calls: CallFacade,
    private _tplService: TemplateService,
    private _router: Router
  ) {
  }

  public ngAfterViewInit(): void {
    this._tplService.register('subHeader', this.subHeader);
  }

  public ngOnInit(): void {
    this.dataSource    = MOCK_DATA();
    this.dataSourceRep = MOCK_DATA().slice(-25);

    this.agents.activeAgent$.subscribe((agent) => {
      this.activeAgent = agent;
    });

    this.calls.activeTranscript$.subscribe((transcript) => {
      this.activeTranscript = transcript;
    });

    this.calls.matchingPercentage$.subscribe((percentage) => {
      this.matchingPercentage = percentage;
      this.matchingScriptPercentage = Math.round(this.countMatchingPercentage(this.activeTranscript.transcript));
      this.coveredScriptPercentage = Math.round(this.countCoveragePercentage(this.activeTranscript.script));
    });
  }

  public selectAgent(event: any): void {
    this.agents.setActiveAgent(event.target?.value);
  }

  public selectCall(event: any): void {
    this.calls.selectCall(event.target?.value);
    this.calls.setMatchingPercentage(38);
  }

  public checkSimilarity(scriptLine: any): boolean {
    return (scriptLine.similarity * 100) >= this.matchingPercentage;
  }

  public checkTranscriptMatches(transcriptLine: any): boolean {
    return transcriptLine.matching_sentence !== '';
  }

  public highLightScriptLine(transcriptLine: any): void {
    if (transcriptLine.matching_sentence !== '') {
      const indexLine = this.activeTranscript.script.findIndex((e) => e.sentence === transcriptLine.matching_sentence);
      if (indexLine >= 0) {
        this.activeTranscript.script[indexLine].hovered = true;
      }
    }
  }

  public unHighLightScriptLine(transcriptLine: any): void {
    if (transcriptLine.matching_sentence !== '') {
      const indexLine = this.activeTranscript.script.findIndex((e) => e.sentence === transcriptLine.matching_sentence);
      if (indexLine >= 0) {
        this.activeTranscript.script[indexLine].hovered = false;
      }
    }
  }

  private countMatchingPercentage(scripts: any): number {
    const lines = scripts.filter((e: any) => e.matching_sentence !== '');
    return lines.length / scripts.length * 100;
  }

  public countCoveragePercentage(script: any): number {
    const lines = script.filter((e: any) => this.checkSimilarity(e));
    return lines.length / script.length * 100;
  }
}

const MOCK_DATA = () => {
  const DATA: any[]        = [];
  const SPEAKERS: string[] = [
    'Harvey',
    'Luke'
  ];

  let currentTime = 30;

  for (let i = 0; i < 100; i++) {
    const min = Math.floor(currentTime / 60);
    const sec = Math.floor(currentTime - min * 60);

    DATA.push({
      time:     `${(
        '0' + min
      ).slice(-2)}:${(
        '0' + sec
      ).slice(-2)}`,
      speaker:  SPEAKERS[Math.floor(Math.random() *
        (
          SPEAKERS.length
        ))],
      sentence: `This is a sample sentence #${i + 1}`
    });

    currentTime +=
      (
        Math.random() * 10
      ) + 5;
  }

  return DATA;
};
