import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { RouterModule } from '@angular/router';

import { CoreModule } from 'src/app/core/core.module';

import AnalyzerComponent from './analyzer.component';
import { ROUTES } from './analyzer.routes';

@NgModule({
    declarations: [ AnalyzerComponent ],
    imports: [
        CoreModule,
        RouterModule.forChild(ROUTES),
        ReactiveFormsModule,
        MatSelectModule,
        MatIconModule,
        MatCardModule
    ]
})
export class AnalyzerModule {}
