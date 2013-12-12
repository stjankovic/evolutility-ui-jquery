/*! ***************************************************************************
 *
 * evol-utility : evol-dico.js
 *
 * Copyright (c) 2013, Olivier Giulieri 
 *
 *************************************************************************** */

var EvoDico = {

    fieldTypes: {
        text: 'text',
        txtm: 'textmultiline',
        bool: 'boolean',
        dec: 'decimal',
        integer: 'integer',
        date: 'date',
        time: 'time',
        datetime: 'datetime',
        pix: 'image',
        //doc:'document',
        lov: 'lov',
        //formula:'formula',
        //html:'html',
        email: 'email',
        url: 'url',
        pwd: 'password',
        color: 'color',
        hidden: 'hidden',
        rating: 'rating',
        tag: 'tag'
        //widget: 'widget',
    },

    fields: function (uiModel, fnFilter) { // TODO: str view should be func filter
        var fs = [];

        function collectFields(te) {
            if (te.elements && te.elements.length > 0) {
                _.each(te.elements, function (te) {
                    collectFields(te);
                });
            } else {
                fs.push(te);
            }
        }

        collectFields(uiModel);
        if (_.isFunction(fnFilter)) {
            fs= _.filter(fs, fnFilter);
        }
        return fs;
    },

    
    customize: function() {
        this.$el.find('.FieldLabel>label').append(EvoUI.icons.customize('id','field'));
        this.$el.find('.table th,h4.PanelLabel').append(EvoUI.icons.customize('id','panel'));
        return this;
    },

    showDesigner: function(id, type, el){
        var h=[],
            $el=$(el),
            $elDes=$('<div class="evol-des-'+type+'">designer</div>');
        this.$el.append($elDes);
        $elDes.position({
            my: "left top",
            at: "right bottom",
            of: $el
        }).Edit({
                toolbar:true,
                model: null,
                uiModel: evodicofield,
                defaultView: 'new' //edit'
            });
        return this;
    },

    showInfoBox:function(msg, type){        
        var $m=this.$el.find('.evol-head-info');
        if($m.length){
            $m.html(msg);
        }else{
            var m=['<div class="evol-head-info alert alert-',type,'">',
                EvoUI.iconClose(),msg,'</div>'].join('');
            this.$el.prepend(m);
        }
        return this;
    }

}

