/*! ***************************************************************************
 *
 * evolutility :: many-charts.js
 *
 * View many charts
 *
 * https://github.com/evoluteur/evolutility
 * Copyright (c) 2014, Olivier Giulieri
 *
 *************************************************************************** */

// Quick and easy implementation w/ the old version of google charts
// must be re-written to use D3.js or other cool stuff
Evol.ViewMany.Charts = Evol.ViewMany.extend({

    viewName: 'charts',

    options: {
        //sizes: '600x300',
        style: 'panel-info',
        autoUpdate: false
    },
/*
    events: {
        'click .evol-field-label .glyphicon-wrench': 'click_customize'
    },
*/
    render: function () {
        var h = [];
        if(this.collection && this.collection.length>0){
            h.push('<div class="evol-many-', this.viewName, '">');
            this._HTMLcharts(h, this.style, this.sizes);
            h.push('</div>');
        }else{
            h.push(Evol.UI.HTMLMsg(Evol.i18n.nodata, '', 'info'));
        }
        this.$el.html(h.join(''));
        return this.setTitle();
    },

    _HTMLcharts: function (h, style, sizes) {
        var EvoUI = Evol.UI,
            EvoDico = Evol.Dico,
            i18n = Evol.i18n,
            fTypes = EvoDico.fieldTypes,
            uiModel = this.uiModel,
            models = this.collection.models,
            iconsPath = this.iconsPath || '',
            chartFields = EvoDico.getFields(uiModel, function(f){
                return (_.isUndefined(f.viewcharts) || f.viewcharts) && (f.type===fTypes.lov || f.type===fTypes.bool || f.type===fTypes.int || f.type===fTypes.money);
            });

        if(chartFields && chartFields.length){
            _.each(chartFields, function(f){
                var groups = _.countBy(models, function(m) {
                        return m.get(f.id);
                    }),
                    data=[],
                    lb,
                    labels=[],
                    entityName=EvoUI.capitalize(uiModel.entities);

                for(var dataSetName in groups) {
                    var nb=groups[dataSetName];
                    if(_.isUndefined(dataSetName)){
                        lb = i18n.na;
                    }else if(dataSetName==='' || dataSetName==='null'){
                        lb = i18n.none;
                    }else if(f.type===fTypes.lov || f.type===fTypes.list){
                        if(f.list && f.list.length && f.list[0].icon){
                            lb = EvoDico.lovTextNoPix(f, dataSetName);
                        }else{
                            lb = EvoDico.lovText(f, dataSetName, Evol.hashLov, iconsPath);
                        }
                    }else if(f.type===fTypes.bool){
                        lb = (dataSetName==='true')?i18n.yes:i18n.no;
                    }else{
                        lb = dataSetName;
                    }
                    data.push(nb);
                    labels.push(lb+' ('+nb+')');
                }
                if(f.type===fTypes.lov){
                    h.push(EvoUI.Charts.Pie(f.labelcharts?f.labelcharts:i18n.getLabel('charts.aByB', entityName, f.label), data, labels, style, sizes));
                }else{
                    h.push(EvoUI.Charts.Bars(f.labelcharts?f.labelcharts:i18n.getLabel('charts.aB', entityName, f.label), data, labels, style, sizes));
                }
            });
        }else{
            h.push(EvoUI.HTMLMsg(i18n.nochart, i18n.badchart));
        }
        h.push(EvoUI.html.clearer);
    },

    setPage: function(){
        // do nothing
        // b/c it can be invoked for all view Many
    }

});
