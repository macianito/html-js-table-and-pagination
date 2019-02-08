/**
 * @file Dynamically Create HTML Table with Pagination
 * @see [Example]{@link http://example.com}
 * @author Mazius <ivanmaciagalan@gmail.com>
 * @see [GITHUB project]{@link https://github.com/macianito/html-js-table-and-pagination/}
 * @version 0.1
 */

// ssh://macianito@github.com/macianito/html-js-table-and-pagination.git

// http://usejsdoc.org/  Documentacio de javascript
// https://milmazz.uno/article/2014/08/27/how-to-document-your-javascript-code/


/** @global */
this.Paginator = (function($) {	
  'use strict';

  /**
   * Create new instance of a Paginator.
   * 
   * @class Represents a Paginator.
   * 
   * @param {Object} options - Options to setup the paginator.
   * 
   */
  var Paginator = function(options) {

    this.init(options);

  };
  /**
   * Initialize and setup the paginator.
   *
   * @param {Object} options - Options to setup paginator.
   * 
   */

  Paginator.prototype.init = function(options) {

      if(this.initiated && !options)
        return;

      options = options || {};

      this.currentPage         = options.currentPage        || 0;
      this.elementsPerPage     = options.elementsPerPage    || 4;
      this.elementsPaginator   = options.elementsPaginator  || 3;
      this.paginatorObj        = options.paginatorObj       || $('#paginator');
      this.containerElements   = options.containerElements  || $('#wrapper-elements');
      this.selectorElements    = options.selectorElements   || '.element';
      this.selectPageCallback  = options.selectPageCallback || null;
      this.changePageCallback  = options.changePageCallback || _changePageCallback;
      
      this.onChangePage      = options.onChangePage  || function() {};

      this.paginatorObj.off();
      
      
      if(!this.initiated) {
        
        // create elements page obj
        this.elementsPageObj = $('<select id="elements-page"></select>');
      
        this.elementsPageObj.append(
          '<option value="4">4</option>' +
          '<option value="10">10</option>' +
          '<option value="50">50</option>' +
          '<option value="300">300</option>'
        );
      
        this.paginatorObj.after(this.elementsPageObj);
      
      } else {
      	this.elementsPageObj.off();
      }
      
      _setEvents.call(this);

      this.initiated = true;

      this.changePage(this.currentPage);

    };

    /**
     * Create the html markup of the paginator.
     *
     */
    Paginator.prototype.createPaginator = function () { // Pagination

      var rows = this.containerElements.find(this.selectorElements + ':not(.row-hidden)'),
          numRows = rows.length,
          pages = Math.ceil(numRows / this.elementsPerPage);

      this.paginatorObj.empty();

      var half = Math.floor(this.elementsPaginator / 2);


      if(this.currentPage - half > 0) {
        this.paginatorObj
          .append('[ <a data-page="0" href="#" >|&lt;</a> ] ')
          .append('[ <a data-page="' + (this.currentPage - 1) + '" href="#" >&lt;</a> ] ');
      }

      var page    = Math.max(this.currentPage - half, 0),
          limitNums = Math.min(page + this.elementsPaginator, pages); // max showed page num

      while(page++ < limitNums) {

        var pageIndex = (page - 1); // real num of page

        var selected = pageIndex === this.currentPage ? ' selected ' : '';

        this.paginatorObj.append(' [ <a data-page="' + pageIndex + '" class="' + selected + '" href="#">' + page + '</a> ] ');

      }

      if(limitNums < pages) {
        this.paginatorObj
          .append(' [ <a data-page="' + limitNums + '" href="#" >&gt;</a> ] ')
          .append(' [ <a data-page="' + (pages - 1) + '" href="#" >&gt;|</a> ] ');
      }

    };

    /**
     * Change current page.
     * 
     * @public
     *
     */

    Paginator.prototype.changePage = function(page, onlyPaginator) { // Pagination

      this.currentPage = page;

      if(!onlyPaginator) {
 
        this.changePageCallback();

      }

      this.onChangePage();

      this.createPaginator();
    };
    
    /**
     * Reload paginator.
     * 
     * @public
     * 
     * @param {Object} options - Options to setup paginator.
     *
     */

    Paginator.prototype.reload = function(options) {

      this.init($.extend(this, options));

    };
    
    /**
     * Refresh paginator.
     * 
     * @public
     *
     */
	
	Paginator.prototype.refresh = function() {

      this.reload();

    };
    
    /**
	 * Callback for adding click event to paginator elements.
	 *
	 * @callback paginationCallback
	 * 
     * @param {Object} evt Event object
     * 
	 */
    
    /**
     * Set the function to use when clicking a paginator element.
     * 
     * @public
     *
     * @param {paginationCallback} callback - A callback to run
     * 
     */
    
    Paginator.prototype.setPageCallback = function(callback) { // Pagination
    
      this.paginatorObj.off('click', 'a');
      
      this.paginatorObj.on('click', 'a', callback.bind(this)); // https://developer.mozilla.org/ca/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    
    };
    
    return Paginator;
    
   
  /**
   * Setup events.
   * 
   * @private
   * 
   */

   
   function _setEvents() {
   	
   	 /* var self = this;
   
     this.elementsPageObj.on('change', function() {

       self.reload({elementsPerPage: $(this).val()});

     });
     
     this.selectPageCallback = function(evt) {

       evt.preventDefault();

       self.changePage($(evt.target).data('page'));

     };
   
     this.paginatorObj.on('click', 'a', this.selectPageCallback); */
    
    this.elementsPageObj.on('change', function(evt) {

      this.reload({elementsPerPage: $(evt.target).val()});
       
      var rows = this.containerElements.find(this.selectorElements + ':not(.row-hidden)').filter(':visible'); // row-hidden clase per ocultar files quan es cerca
       
      if(rows.length == 0) {
      
       	this.changePage(0);
      
      }
       

     }.bind(this)); // https://developer.mozilla.org/ca/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
     
     this.selectPageCallback = this.selectPageCallback || function(evt) {

       evt.preventDefault();

       this.changePage($(evt.target).data('page'));

     };
   
     this.paginatorObj.on('click', 'a', this.selectPageCallback.bind(this)); // https://developer.mozilla.org/ca/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
   
   }
   
   /**
     * Default function callback when changing the page.
     * 
     * @private
     *
     * @param {paginationCallback} callback - A callback to run
     * 
     */
   
   function _changePageCallback() {
   	
   	  var rows = this.containerElements.find(this.selectorElements + ':not(.row-hidden)');

      rows.hide();

      rows.slice(this.currentPage * this.elementsPerPage, (this.currentPage + 1) * this.elementsPerPage).show();
   	
   }


})(jQuery); // Fi Paginator


/**
 * Create a search string based on values from search inputs.
 * 
 * @global
 * @function
 * 
 */


function createSearchString() {

  var strSearch = '';
  
  var objSearch = {};
  
  $('.search-input').map(function() {
  	
  	objSearch[this.id] = $(this).val();
  	
  });

  for(var i in objSearch) {
    if(objSearch[i].trim() != '')
	  strSearch += objSearch[i] + ' & ';
  }           

  return strSearch.slice(0, -2);	

} 



// ORDERING ///////////////////////////

/** @global */
this.Table = (function($) {

  /**
   * Create new instance of a Table.
   * 
   * @class Represents a Table.
   * 
   * @param {Object} options - Options of the table.
   * 
   */
  var Table = function(options) {

    this.tableObj     =  options.tableObj     || $('#table');
    this.searchInput  =  options.searchInput  || $('#search');
    this.sortDataType =  options.sortDataType || ['int', null, 'string', 'string', 'string', 'string', 'string',
                                                  'string', 'string', 'string', 'string', 'string', 'string', 'string', 
                                                  'string', 'string', 'string', 'string', 'string', 'string', 'string']; // array amb els tipus collacio per l'ordenacio de cada columna

  
	this.pagination = new Paginator({
      elementsPerPage : $('#elements-page').val(),
      selectorElements: 'tr',
      containerElements: this.tableObj.children('tbody'),
      onChangePage: function() { } 
    });  
	  
    _setEvents.call(this);

  
  };
  
  /**
   * Add elements to the table. The table can be filled or you can append o prepend
   * the elements
   * 
   * @public
   *
   * @param   {Object}  elements         Collection of items to append
   * @param   {Object}  params           Params
   * @param   {string}  params.mode      Mode of insertion
   * @param   {string}  params.tdAttrId  Establish cell id as id o class attributte
   *  
   */
  
  Table.prototype.addElements = function(elements, params) {
  	
  	params = params || {};
  	
  	var TBody = this.tableObj.children('tbody'),
  	    tdAttrId = params.tdAttrId || 'class',
  	    mode = params.mode || 'fill';
  	    
  	if(mode == 'fill') {
  	  TBody.empty();
  	}
  	
  	for(var i in elements) {

       var tr = $('<tr id="' + i + '"></tr>');

       if(mode == 'prepend') {
         TBody.prepend(tr);
       } else {
       	 TBody.append(tr);
       }
       
       $.each(elements[i], function(index, value) {
	     tr.append('<td ' + tdAttrId + '="' + index + '">' + value + '</td>');
	   });
  	
  	}
  	
  	this.pagination.refresh();
  	
  };
  
  /**
   * Append elements to the table.
   * 
   * @public
   *
   * @param   {Object}  elements    Collection of items to append
   * @param   {Object}  params      Params
   * @param   {string}  params.mode Mode of insertion
   *  
   */
  
  Table.prototype.appendElements = function(elements, params) {
  	
  	params = params || {};
  	
  	params.mode = 'append';
  	
  	this.addElements(elements, params);
  	
  };
  
  /**
   * Empty the content of the table.
   * 
   * @public
   *
   * @param   {Object}  elements     Collection of items to insert
   * @param   {Object}  params       Params
   * @param   {string}  params.mode  Mode of insertion
   *  
   */
  
  Table.prototype.prependElements = function(elements, params) {
  	
  	params = params || {};
  	
  	params.mode = 'prepend';
  	
  	this.addElements(elements, params);
  	
  };
  
  /**
   * Empty the table.
   *
   * @public
   * 
   */
  
  Table.prototype.emptyTable = function() {
  	
  	this.tableObj.children('tbody').empty();
  	
  	this.pagination.refresh();
  	
  };
  
  
  /**
   * Sort a column selected by index and according the type of data.
   * 
   * @public
   * 
   * @param   {number}  index     num of column to order
   * @param   {string}  typeData  type of data to compare
   * @param   {boolean} asc       whether the comparison will be asc or desc
   */

  Table.prototype.orderByIndex = function(index, typeData, asc) {

    var tBody = this.tableObj.children('tbody'),
        rows = tBody.find('tr').toArray(),
        arrayToSort = new Array(),
        arrayAssoc = {};


    for(var i = 0; i < rows.length; i++) {

      var rowDom = rows[i],
          rowHtml = $(rowDom).children('td:eq(' + index + ')').html();

      arrayToSort.push(rowHtml);

      arrayAssoc[rowHtml] ? arrayAssoc[rowHtml].push(rowDom) : arrayAssoc[rowHtml] = [rowDom];

    }

    if(typeData === 'string') {

      asc ? arrayToSort.sort(_compareStringsAsc) : arrayToSort.sort(_compareStringsDesc);

    } else {

      arrayToSort.sort(function (a, b) { return asc ? a - b : b - a ; } );

    }

    //tBody.empty();


    for(var i = 0; i < arrayToSort.length; i++) {

      var arrayRows = arrayAssoc[arrayToSort[i]];

      for(var j = 0; j < arrayRows.length; j++) {

        tBody.append(arrayRows[j]);

      }

    }

    //console.log(arrayToSort);

  };
  
  return Table;

  /**
   * Takes 2 strings, compare them desc and returns the result.
   * 
   * @private
   * 
   * @param   {string} a     the first string
   * @param   {string} b     the second string
   *
   * @returns {number} the result of the comparison
   */

  function _compareStringsDesc(a, b) {

    var A = a.toUpperCase(), // ignore upper and lowercase
        B = b.toUpperCase(); // ignore upper and lowercase

    if(A > B) return -1;
    if(A < B) return 1;
    return 0; // names must be equal

  }
  
  /**
   * Takes 2 strings, compare them asc and returns the result.
   *
   * @private
   * 
   * @param   {string} a     the first string
   * @param   {string} b     the second string
   *
   * @returns {number} the result of the comparison
   */

  function _compareStringsAsc(a, b) {

    var A = a.toUpperCase(), // ignore upper and lowercase
        B = b.toUpperCase(); // ignore upper and lowercase

    if(A < B) return -1;
    if(A > B) return 1;
    return 0; // names must be equal

  }
  
  
  
  /**
   * Setup events of the table.
   * 
   * @private
   * 
   */

  function _setEvents() {

    /// ORDENATION ////////////

    var tableHeaders = this.tableObj.find('> thead > tr > th'),
        self = this;

    this.tableObj.off().on('click', '> thead > tr > th', function() {

      var header = $(this);
          index = header.index();

      if(!self.sortDataType[index])
        return;

      if(!header.is('.asc, .desc')) {

        tableHeaders.removeClass('asc desc');

        header.toggleClass('asc');

      } else {

        header.toggleClass('asc desc');
      }

      var sortDataType = self.sortDataType[index];

      self.orderByIndex(index, sortDataType, header.hasClass('asc') ? true : false);

      self.pagination.reload();

    });

    // SEARCH BOX ////////////////

    this.searchInput.on('keyup', function() {

      var searchVal = this.value,
          rows = self.tableObj.find('tbody tr');


      if(searchVal === '') {
        rows.removeClass('row-hidden');
        self.pagination.reload();
        return;
      }
      
      if(searchVal.indexOf(('&')) === - 1 ) { // sino hi ha un & es el car que que hi ha OR o res
      
	      searchVal = searchVal.split('|');
	      
	      searchVal.forEach(function(item, index, arr) { // TRIM
			arr[index] = item.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''); // fem trim
		  });
		  
		  searchVal = searchVal.join('|');
	
	      var searchValRegex = new RegExp('(' +searchVal + ')', "i");
	
	      rows.each(function() {
	
	        var element = $(this),
	            //children = element.children('.name, .email, .login'), // restringit
	            children = element.children('td');
	            
	        var strRow = children.map(function() { // construim cadena amb tots els elements fila
			  return this.innerHTML;
			})
			.get()
			.join(' '); // frases separades per espai per evitar que la unio de dues cel-les doni error perque es formi una paraula que s'esta cercant

	        if(searchValRegex.test(strRow))
	           element.removeClass('row-hidden');
	        else
	           element.addClass('row-hidden');
	
	      });

      } else { // AND/&
      	
      	searchVal = searchVal.split('&');
      	
      	searchVal.forEach(function(item, index, arr) { // TRIM
		  arr[index] = item.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''); // fem trim
		});
      	
      	rows.each(function() {
	
	        var element = $(this),
	            //children = element.children('.name, .email, .login'), // restringit
	            children = element.children('td'),
	            found = true;
	            
	        var strRow = children.map(function() {
			  return this.innerHTML;
			})
			.get()
			.join(' ');
 
	        for(var len = searchVal.length, i = 0; i < len; i++) {
	
	          if(strRow.indexOf(searchVal[i]) === -1) { // si una search word no la troba dins la cadena formada per tota la fila s'ha de ocultar aquella fila
	          	element.addClass('row-hidden');
	            return;
	          }
	
	        }
	        
	        element.removeClass('row-hidden');
	
	     });
      	
      	
      }

      self.pagination.reload();

    });

  };
 
})(jQuery); // Fi Table


