import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
import { Button } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.css"


class AllIssues extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: "",
      priority: "",
      wc_criterion: "",
      issueList: [],
      myButtons: "",
      myTools: "",
      currentList: [],
      issue: [],
      count: 0,
      finalCookieArray: [],
      cookies: ""
    }

    this.handleChange = this.handleChange.bind(this)
    this.addIssue = this.addIssue.bind(this)
    this.filter = this.filter.bind(this)
    this.filterTools = this.filterTools.bind(this)
    this.viewAll = this.viewAll.bind(this)
    this.clearCookies = this.clearCookies.bind(this)
  }


  componentDidMount() {

    let myButtonList = {}
    let myToolList = {}
    this.props.data.allNodeIssue.edges.forEach(elem => {
     for (let i=0; i<elem.node.field_how_to_test.length; i++){
      if (!(elem.node.field_how_to_test[i] in myToolList)) {
        myToolList[elem.node.field_how_to_test[i]] = [elem.node]
      } else {
        myToolList[elem.node.field_how_to_test[i]].push(elem.node)
      }
    }
    })
    this.props.data.allNodeIssue.edges.forEach(elem => {
      if (!(elem.node.field_area_of_concern in myButtonList)) {
        myButtonList[elem.node.field_area_of_concern] = [elem.node]
      } else {
        myButtonList[elem.node.field_area_of_concern].push(elem.node)
      }
    })
    let newArray = []
    for (let key in myButtonList) {
      for (let i = 0; i < myButtonList[key].length; i++) {
        let currentElem = myButtonList[key][i]
        newArray.push(currentElem)
      }
    }
    this.setState({ currentList: newArray, myButtons: myButtonList, myTools: myToolList })
  }

  filter(evt) {
    this.setState({ currentList: this.state.myButtons[evt.target.value] })
  }
  filterTools(evt) {
    this.setState({ currentList: this.state.myTools[evt.target.value] })
  }

  viewAll() {
    let newArray = []
    for (let key in this.state.myButtons) {
      for (let i = 0; i < this.state.myButtons[key].length; i++) {
        let currentElem = this.state.myButtons[key][i]
        newArray.push(currentElem)
      }
    }
    this.setState({ currentList: newArray })
  }

  handleChange(evt) {
    const name = evt.target.name
    const value = evt.target.value
    this.setState({ [name]: value })
  }

  addIssue(evt) {
    evt.preventDefault()
    this.state.count++
    let cookieArray = ["*="+evt.target.value, "*="+this.state.notes, "*="+this.state.priority]

   //this.state.finalCookieArray.push(cookieArray)
//     let cookies = "wc_criterion="+evt.target.value+" notes="+this.state.notes+" priority="+this.state.priority+""
//  document.cookie = cookies
    //save the issues on a cookie!

    this.state.issueList.push({
      wc_criterion: evt.target.value,
      notes: this.state.notes,
      priority: this.state.priority,
    })

let cookieString = cookieArray.join(" ")
//console.log("cookie Array: ", cookieArray)
//["wc_criterion=2.4.2 Page Titled", "notes=hello", "priority=high"]
//console.log("cookie String: ", cookieString)
this.state.cookies = this.state.cookies + " " + cookieString
//wc_criterion=2.4.2 Page Titled notes=hello priority=high
//"*=2.4.2 Page Titled *=hello *=high"
window.document.cookie = this.state.cookies
//let newCookieArray = document.cookie.split("*=")
//console.log("newCookieArray: ", newCookieArray)
//add to an array that i can loop over now for the table

    this.setState({ wc_criterion: "", notes: "", priority: "" })

  }

clearCookies(){
  window.document.cookie = '*=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  window.location.reload()

}
  render() {
    const { data } = this.props
    console.log("data count", data.allNodeIssue.edges.length)

    let myCookieArray = window.document.cookie.split("*=").splice(1)
    let myCookieArrayFinal = []
    let lengthCookie = myCookieArray.length

    while (myCookieArray.length>0){
      let currentArray = []
    for (let i=0; i<3; i++){
      let currentElem = myCookieArray[i]

        currentArray.push(currentElem)
    }
    myCookieArray = myCookieArray.slice(3)
    myCookieArrayFinal.push(currentArray)
  }

    console.log("FINAL: ", myCookieArrayFinal)

console.log("cookie: ", document.cookie)

    return (
      <div className="wrapper">
        <div className="main">
          <Layout>

            <div className="buttonFilters">
              <Button
                size="sm"
                variant="light"
                onClick={this.viewAll}
                type="submit"
              >
                View All
              </Button>

              <select onChange={this.filter}>
              {this.state.myButtons
                ?
                Object.keys(this.state.myButtons).map((key, index) => (
                      <option
                        key={index}

                        value={key}>
                        {key}
                      </option>
                  ))
                : null}
                </select>
            </div>

            {/* <select onChange={this.filterTools}>
              {this.state.myTools
                ?
                Object.keys(this.state.myTools).map((key, index) => (
                      <option
                        key={index}

                        value={key}>
                        {key}
                      </option>
                  ))
                : null}
                </select> */}
            <form>
              <div className="issue">

      {this.state.currentList.map((elem, index) => {
        let notes, priority

              return (
                  <div key={index}>
                    <div><strong>Area of Concern: </strong>{elem.field_area_of_concern}</div>

                    <strong>Issue: </strong>{elem.field_issue}
                    <div><strong>How to Test: </strong>{elem.field_how_to_test}</div>
                    <div><strong>WCAG Criterion: </strong>{elem.field_wc}</div>

                    <div>
                      <a href={elem.field_understanding_link}>
                        Understanding the Criterion
                      </a>
                    </div>
                    <label htmlFor="priority"><strong>Priority: </strong></label>
                    <input
                      type="text"
                      id="priority"
                      name="priority"
                      placeholder={elem.field_default_priority}
                      value={priority}
                      onChange={this.handleChange}
                    />
                    <br />
                    <div><strong>Default notes: </strong>{elem.field_default_notes}</div>
                    <label htmlFor="notes"><strong>My Notes: </strong></label>
                  <textarea
                      id="notes"
                      name="notes"
                      value={notes}
                      onChange={this.handleChange}
                    />
                    <button value={elem.field_wc} onClick={this.addIssue} type="submit">
                      Add Issue to Report
                    </button>
                  </div>
                )}
      )}
              </div>{" "}
            </form>
          </Layout>
        </div>

        <div className="sidebar">

{/* Netlify will only allow 100 submissions/month for free */}

{/* see example
https://github.com/sw-yx/gatsby-netlify-form-example-v2/blob/master/src/pages/contact.js */}
<ul>
{myCookieArray.map((elem, index) => (
  <li key={index}>{elem}</li>
))}
</ul>
          <table className="sopretty">
            <thead>
              <tr>
                <th>#</th>
                <th>WCAG Criterion:</th>
                <th>Description:</th>
                <th>Priority:</th>
              </tr>
            </thead>
            <tbody>


  {myCookieArrayFinal.map((elem, index) => (
    <tr key={index}>
    <td>{index+1}</td>
    <td>{elem[0]}</td>
    <td>{elem[1]}</td>
    <td>{elem[2]}</td>
    </tr>
  ))}

              {/* {this.state.issueList.map((elem, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{elem.wc_criterion}</td>
                  <td>{elem.notes}</td>
                  <td>{elem.priority}</td>
                </tr>
              ))} */}
            </tbody>
          </table>
          <button onClick={this.clearCookies}>Clear Cookies</button>
        </div>



      </div>
    )
  }
}
export default AllIssues

export const query = graphql`
  query allNodeIssue {
    allNodeIssue {
      edges {
        node {
          field_issue
          field_default_priority
          field_default_notes
          field_area_of_concern
          field_wc
          field_understanding_link
          field_how_to_test
        }
      }
    }
  }
`
