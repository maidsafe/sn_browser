/* eslint-disable func-names */
import { expect } from 'chai';
import * as tabs from 'reducers/tabs';
import { fromJS } from 'immutable';

describe( '_deactivateOldTab', () =>
{

    it( 'should exist', () =>
    {
        expect( tabs._deactivateOldTab ).to.exist;
    } );

    it( 'should return a tabs state array', () =>
    {
        let state = fromJS( [ { isActiveTab: true } ] );

        expect( tabs._deactivateOldTab(  state  ) ).to.be.an.Array;
        expect( tabs._deactivateOldTab(  state  ) ).to.not.be.undefined;
    } );

    it( 'should deactivate any tab with isActive set', () =>
    {
        let state = fromJS( [ { isActiveTab: true } ] );

        expect( tabs._deactivateOldTab( state ) ).to.be.an.Array;
        expect( tabs._deactivateOldTab( state ) ).to.not.equal( state );
        expect( tabs._deactivateOldTab( state ).get( 0 ).toJS() ).to.be.an.Object;

        state.push( {isActiveTab: true } );
        expect( tabs._deactivateOldTab( state ).get( 0 ).toJS() ).to.deep.equal( { isActiveTab: false } );
    } );

    it( 'should have the same length array', () =>
    {
        let state = fromJS( [ { isActiveTab: true }, { isActiveTab: true } ] );

        expect( tabs._deactivateOldTab( state ) ).to.be.an.Array;
        expect( tabs._deactivateOldTab( state ).size ).to.equal( 2 );
    } );

    it( 'should return an immutable array', () =>
    {
        let state = fromJS( [{isActiveTab: false}] );

        //isImmutable not working...
        expect( tabs._setActiveTab( 0, state ).toJS ).to.exist;
    });
} );






describe( '_setActiveTab', () =>
{
    it( 'should exist', () =>
    {
        expect( tabs._setActiveTab ).to.exist;
    });

    it( 'should return an immutable array', () =>
    {
        let state = fromJS( [{isActiveTab: false}] );

        //isImmutable not working...
        expect( tabs._setActiveTab( 0, state ).toJS ).to.exist;
    });

    it( 'should set index as Active.', () =>
    {
        let state = fromJS( [{isActiveTab: false}, {isActiveTab: false}] );

        expect( tabs._setActiveTab( 0, state ).toJS()[0].isActiveTab ).to.be.true;
    });

    it( 'should deactivate old tab', () =>
    {
        let state = fromJS( [{isActiveTab: false}, {isActiveTab: true}] );

        expect( tabs._setActiveTab( 0, state ).toJS()[0].isActiveTab ).to.be.true;
        expect( tabs._setActiveTab( 0, state ).toJS()[1].isActiveTab ).to.be.false;
    });

});




describe( '_updateTabHistory', () =>
{
    it( 'should exist', () =>
    {
        expect( tabs._updateTabHistory ).to.exist;
    });
    xit( 'should add a history array if it doesnt exist' );
    xit( 'should add a new url' );
    xit( 'should return an immutable array' );
    xit( 'should not add a url if its the same as the previous one' );
    xit( 'should allow a url to exist twice as long as they are not consecutive' );
});
