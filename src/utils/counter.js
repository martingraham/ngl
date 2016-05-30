/**
 * @file Counter
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */


import { Log, Debug } from "../globals.js";


function Counter(){

    var SIGNALS = signals;

    this.count = 0;

    this.signals = {

        countChanged: new SIGNALS.Signal(),

    };

}

Counter.prototype = {

    clear: function(){

        this.change( -this.count );

    },

    change: function( delta ){

        this.count += delta;
        this.signals.countChanged.dispatch( delta, this.count );

        if( this.count < 0 ){

            Log.warn( "Counter.count below zero", this.count );

        }

    },

    increment: function(){

        this.change( 1 );

    },

    decrement: function(){

        this.change( -1 );

    },

    listen: function( counter ){

        // incorporate changes of another counter

        this.change( counter.count );

        counter.signals.countChanged.add( function( delta, count ){

            this.change( delta );

        }.bind( this ) );

    },

    onZeroOnce: function( callback, context ){

        if( this.count === 0 ){

            callback.call( context, 0, 0 );

        }else{

            var fn = function(){

                if( this.count === 0 ){

                    this.signals.countChanged.remove( fn, this );

                    callback.apply( context, arguments );

                }

            };

            this.signals.countChanged.add( fn, this );

        }

    },

    dispose: function(){

        this.clear();

    }

};


export default Counter;