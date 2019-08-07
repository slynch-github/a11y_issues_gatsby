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
      issue: []
    }

    this.handleChange = this.handleChange.bind(this)
    this.addIssue = this.addIssue.bind(this)
    this.filter = this.filter.bind(this)
    this.filterTools = this.filterTools.bind(this)
    this.viewAll = this.viewAll.bind(this)
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
    this.state.issueList.push({
      wc_criterion: evt.target.value,

      notes: this.state.notes,
      priority: this.state.priority,
    })
    this.setState({ wc_criterion: "", notes: "", priority: "" })
  }

  render() {
    const { data } = this.props
    console.log("data count", data.allNodeIssue.edges.length)

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
            <form name="contact" method="POST" data-netlify="true" action="/">
              <div className="issue">

      {this.state.currentList.map((elem, index) => {
        let notes, priority

              return (
                  <div key={index}>
                    <div>Area of Concern: {elem.field_area_of_concern}</div>

                    Issue: {elem.field_issue}
                    <div>How to Test: {elem.field_how_to_test}</div>
                    {/* <div>WCAG Criterion: {elem.field_wc}</div> */}
                    <label htmlFor="wcagcriterion">WCAG Criterion</label><input id="wcagcriterion" type="text" placeholder={elem.field_wc} name="wcagcriterion">
                    </input>
                    <div>
                      <a href={elem.field_understanding_link}>
                        Understanding the Criterion
                      </a>
                    </div>
                    <label htmlFor="priority">Priority: </label>
                    <input
                      type="text"
                      id="priority"
                      name="priority"
                      placeholder={elem.field_default_priority}
                      value={priority}
                      onChange={this.handleChange}
                    />
                    <br />
                    <div>Default notes: {elem.field_default_notes}</div>
                    <label htmlFor="notes">My Notes: </label>
                  <textarea
                      id="notes"
                      name="notes"
                      value={notes}
                      onChange={this.handleChange}
                    />
                    <button type="submit">
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
        <form name="contact" method="post" data-netlify="true" data-netlify-honeypot="bot-field">
<input type="hidden" name="form-name" value="contact" />

        <p>
    <label>Your Name: <input type="text"  name="name" /></label>   
  </p>
  <p>
    <label>Your Email: <input type="email" name="email" /></label>
  </p>
  <p>
    <label>Your Role: <select name="role[]" multiple>
      <option value="leader">Leader</option>
      <option value="follower">Follower</option>
    </select></label>
  </p>
  <p>
    <label>Message: <textarea name="message"></textarea></label>
  </p>
  <p>
    <button type="submit">Send</button>
  </p>
</form>
          <table className="sopretty">
            <thead>
              <tr>
                <th>#</th>
                <th>WCAG Criterion</th>
                <th>Description</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {this.state.issueList.map((elem, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{elem.wc_criterion}</td>
                  <td>{elem.notes}</td>
                  <td>{elem.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
