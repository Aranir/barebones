import * as React from 'react';
import gql from "graphql-tag/index"; import graphql from "react-apollo/lib/graphql";
import {Table} from 'react-bootstrap'
import "!style-loader!css-loader!sass-loader!./Test.scss";



const TestQuery = gql` query {
  authors{
    id
    firstName
    lastName
    posts {
      id
      title
      text
    }
  }
}`;

interface Post {
    id?: string;
    title?: string;
    text?: string;
    tags?: string;
}

interface Author {
    id?: string;
    firstName?: string;
    lastName?: string;
    posts?: Post[]
}



let renderItems = (authors: Author[]) => {
    return authors.map(a =>
        <tr key={a.id}>
            <td>{a.id}</td>
            <td>{a.firstName}</td>
            <td>{a.lastName}</td>
            <td>{a.posts.length}</td>
        </tr>
    )
};

interface TestProps {
    data: {
        authors: Author[]
        loading: boolean

    },
}

let Test = ({data: {authors, loading}}: TestProps) => {
    // let Test = (props: TestProps) => {

    let element: JSX.Element[];
    if (!loading) {
        element = renderItems(authors)
    }
    // console.log(props);
    return (
        <div>
            <Table striped bordered condensed hover>
                <tbody>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Post Count</th>
                </tr>
                {element}
                </tbody>
            </Table>

        </div>
    );
};



export default graphql(TestQuery)(Test)

