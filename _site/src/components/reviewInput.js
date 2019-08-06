<div>
<label htmlFor="websiteName">Website Name: </label>
<input
  type="text"
  id="websiteName"
  name="websiteName"
  value={this.state.websiteName}
  onChange={this.handleChange}
/>
<br />
<label htmlFor="websiteURL">Website URL: </label>
<input
  type="text"
  id="websiteURL"
  name="websiteURL"
  value={this.state.websiteURL}
  onChange={this.handleChange}
/>
<br />
<label htmlFor="deliveredTo">Delivered To: </label>
<input
  type="text"
  id="deliveredTo"
  name="deliveredTo"
  value={this.state.deliveredTo}
  onChange={this.handleChange}
/>
<br />
<label htmlFor="dateDelivered">Date Delivered: </label>
<input
  type="text"
  id="dateDelivered"
  name="dateDelivered"
  value={this.state.dateDelivered}
  onChange={this.handleChange}
/>
<br />
<label htmlFor="reviewer">Reviewer: </label>
<input
  type="text"
  id="reviewer"
  name="reviewer"
  value={this.state.reviewer}
  onChange={this.handleChange}
/>
<br />
<label htmlFor="scope">Scope: </label>
<textarea
  rows="3"
  cols="50"
  id="scope"
  name="scope"
  value={this.state.scope}
  onChange={this.handleChange}
/>
<br />
<br />
</div>