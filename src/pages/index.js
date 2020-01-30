import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
import { Button } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.css"

class AllIssues extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      issues: [{notes: "", priority: "", wc_criterion: ""}],
      notes: "",
      priority: "",
      wc_criterion: "",
      myButtons: "",
      myTools: "",
      currentList: [],
      issue: [],
      finalCookieArray: [],
      cookieArrayFinal: []
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
      this.setState((prevState) => ({
        issues: [...prevState.issues, {notes: "", priority: "", wc_criterion: ""}],
      }))
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

    let myCookieArray = window.document.cookie.split("*=").splice(1)

    let myCookieArrayFinal = []
    
    
    while (myCookieArray.length>0){
      let currentArray = []
    for (let i=0; i<3; i++){
      let currentElem = myCookieArray[i]
    
        currentArray.push(currentElem)
    }
    myCookieArray = myCookieArray.slice(3)
    myCookieArrayFinal.push(currentArray)
    }
    
    this.setState({cookieArrayFinal: myCookieArrayFinal})
    
  }

  filter(evt) {
    if (evt.target.value === "all"){
      this.viewAll()
    }else {
      this.setState({ currentList: this.state.myButtons[evt.target.value] })
    }
    
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
    let issues = [...this.state.issues]
    issues[evt.target.dataset.id][evt.target.className] = evt.target.value
    this.setState({issues}, () => this.state.issues)
    // const name = evt.target.name
    // const value = evt.target.value
    // this.setState({ [name]: value })
  }

  addIssue(evt) {
    evt.preventDefault()
    let newNote = ""
    let newPriority = ""
let newIssues = [...this.state.issues]
for (let i=0; i<newIssues.length; i++){
  let currentIssue = newIssues[i]
  
  if (currentIssue.notes.length>0){
    newNote = currentIssue.notes
    newPriority = currentIssue.priority
  }
}
    let cookieArray = ["*="+evt.target.value, "*="+newNote, "*="+newPriority]
//let cookieArray = ["*="+evt.target.value, "*="+this.state.notes, "*="+this.state.priority]
    //save the issues on a cookie!

    // this.state.issueList.push({
    //   wc_criterion: evt.target.value,
    //   notes: this.state.notes,
    //   priority: this.state.priority,
    // })

let cookieString = cookieArray.join(" ")

let myDate = "; expires=Fri, 31 Dec 9999 12:00:00 UTC"

if (window.document.cookie.length>0){
  window.document.cookie = window.document.cookie + " " + cookieString + myDate
}else {
  window.document.cookie = cookieString + myDate
}

let clearIssues = [...this.state.issues]
for (let i=0; i<clearIssues.length; i++){
  let currentIssue = clearIssues[i]
  
  if (currentIssue.notes.length>0){
    currentIssue.notes = ""
    currentIssue.priority = ""
  }
}

this.setState({issues: clearIssues})

let myCookieArray = window.document.cookie.split("*=").splice(1)

let myCookieArrayFinal = []
this.setState({cookieArrayFinal: []})


while (myCookieArray.length>0){
  let currentArray = []
for (let i=0; i<3; i++){
  let currentElem = myCookieArray[i]

    currentArray.push(currentElem)
}
myCookieArray = myCookieArray.slice(3)
myCookieArrayFinal.push(currentArray)
}

this.setState({cookieArrayFinal: myCookieArrayFinal})

  }
  

clearCookies(){
  window.document.cookie = '*=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  window.location.reload()

}
  render() {
    if (typeof window !== 'undefined') {
    const { data } = this.props
    console.log("data count", data.allNodeIssue.edges.length)
    console.log("finalcookiearray", this.state.finalCookieArray)
    console.log("cookieArrayFinal", this.state.cookieArrayFinal)


    return (
      <div className="wrapper">
        <div className="main">
          <Layout>

            <div className="buttonFilters">
              <Button
                size="sm"
                block
                variant="secondary"
                onClick={this.viewAll}
                type="submit"
              >
                View All
              </Button>

              <select onChange={this.filter}>
              <option value="all">Select an area of concern</option>
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
                      data-id={index}
                      className="priority"
                      placeholder={elem.field_default_priority}
                      
                      value={this.state.issues[index].priority || ""}
                      onChange={this.handleChange}
                    />
                    <br />
                    <div><strong>Default notes: </strong>{elem.field_default_notes}</div>
                    <label htmlFor="notes"><strong>My Notes: </strong></label>
                  <textarea
                      id="notes"
                      name="notes"
                      data-id={index}
                      className="notes"
                      value={this.state.issues[index].notes || ""}
                      onChange={this.handleChange}
                    />
                    <button value={`${elem.field_understanding_link}^${elem.field_wc}`} onClick={this.addIssue} type="submit">
                      Add Issue to Report
                    </button>
                    <hr className="divider" />
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


  {this.state.cookieArrayFinal ? (this.state.cookieArrayFinal.map((elem, index) => (
    <tr key={index}>
    <td>{index+1}</td>
    <td><a href={`${elem[0].split("^")[0]}`}>{`${elem[0].split("^")[1]}`}</a></td>
    <td>{elem[1]}</td>
    <td>{elem[2]}</td>
    </tr>
  ))): null
}

            </tbody>
          </table>
          <button onClick={this.clearCookies}>Clear Cookies</button>
        </div>



      </div>
    )
  }

return null
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

