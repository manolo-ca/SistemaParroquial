import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'primeng/components/common/shared';
import { GenericService } from './service/generic.service';
import { ModuleWithProviders } from '@angular/compiler/src/core';
@NgModule({
    imports: [CommonModule, RouterModule],
    declarations: [],
    exports: []
})
export class SpringGenericMVCModule  {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SpringGenericMVCModule,
            providers: [GenericService,HttpClient]
        };
    }
}
