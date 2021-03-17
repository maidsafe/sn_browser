import React from 'react';
import { shallow } from 'enzyme';

import { reactNodeToElement } from '$Utils/reactNodeToElement';

describe( 'reactNodeToElement', () => {
    it( 'should exist', () => {
        expect( reactNodeToElement ).not.toBeNull();
    } );

    it( 'returns React DOMElement', () => {
        const paraOne = 'Paragraph 1 text';
        const paraTwo = 'Paragraph 2 text';
        const paraThree = 'Paragraph 3 text';
        const nodeObject = {
            _owner: null,
            key: null,
            props: {
                className: 'parentDiv',
                children: [
                    {
                        _owner: null,
                        props: {
                            children: paraOne,
                            key: '1',
                        },
                        ref: null,
                        type: 'p',
                    },
                    {
                        _owner: null,
                        props: {
                            children: paraTwo,
                            key: '2',
                        },
                        ref: null,
                        type: 'p',
                    },
                    {
                        _owner: null,
                        props: {
                            children: paraThree,
                            key: '3',
                        },
                        ref: null,
                        type: 'p',
                    },
                ],
            },
            ref: null,
            type: 'div',
        };
        const wrapper = shallow( reactNodeToElement( nodeObject ) );
        const expectedElement = (
            <div className="parentDiv">
                <p>Paragraph 1 text</p>
                <p>Paragraph 2 text</p>
                <p>Paragraph 3 text</p>
            </div>
        );
        expect( wrapper.equals( expectedElement ) ).toBeTruthy();
    } );
} );
