import * as React from 'react';
import gql from "graphql-tag/index";
import graphql from "react-apollo/lib/graphql";
import {Table} from 'react-bootstrap'
import "!style-loader!css-loader!sass-loader!./Test.scss";
import {Author} from "./entities/Author";



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

// let Test = ({data: {authors, loading}}: TestProps) => {
let Test = (props: TestProps) => {
  let {loading, authors} = props.data;
  console.log("props", props);
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
  {/*return (<div>Miau</div>)*/}
};



export default graphql(TestQuery)(Test)

