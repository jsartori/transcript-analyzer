import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CoreModule } from 'src/app/core/core.module';

import AnalyzerComponent from './analyzer.component';
import { ROUTES } from './analyzer.routes';

@NgModule({
    declarations: [ AnalyzerComponent ],
    imports: [
        CoreModule,
        RouterModule.forChild(ROUTES),
        ReactiveFormsModule
    ]
})
export class AnalyzerModule {}
