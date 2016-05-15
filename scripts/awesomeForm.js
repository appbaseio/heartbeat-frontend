// import React, { Component } from "react";
// import { render } from "react-dom";
// import Form from "react-jsonschema-form";
//
// const schema = {
//   title: "Todo",
//   type: "object",
//   required: ["title"],
//   properties: {
//     title: {type: "string", title: "Title", default: "A new task"},
//     done: {type: "boolean", title: "Done?", default: false}
//   }
// };
//
// const formData = {
//   title: "First task",
//   done: true
// };
//
// const log = (type) => console.log.bind(console, type);
//
// export default class AwesomeForm extends Component {
//
//
//
//     render(){
//         return(
//             <Form schema={schema}
//                   formData={formData}
//                   onChange={log("changed")}
//                   onSubmit={log("submitted")}
//                   onError={log("errors")} />
//         );
//     };
//
// }
