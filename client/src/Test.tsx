import * as React from 'react';
import gql from "graphql-tag/index"; import graphql from "react-apollo/lib/graphql";
import {Table} from 'react-bootstrap'

const TestQuery = gql` query {
  items {
    id
    name
    level
  }
}`;

let renderItems = (items: {id:string, name:string, level:number}[]) => {
    return items.map(item =>
        <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.level}</td>
        </tr>
    )
};

interface TestProps {
    data: {
        items: {id: string, name: string, level: number}[]
        loading: boolean

    },
}

let Test = ({data: {items, loading}}: TestProps) => {
    // let Test = (props: TestProps) => {

        let element: JSX.Element[];
    if (!loading) {
        element = renderItems(items)
    }
    // console.log(props);
    return (
        <div>
            <Table striped bordered condensed hover>
                <tbody>
                {element}
                </tbody>
            </Table>

        </div>
    );
};



export default graphql(TestQuery)(Test)

