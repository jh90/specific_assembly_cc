import React from 'react';
import request from 'superagent';

export default class App extends React.Component {
  constructor () {
    super();
    this.state = {
      company: '',
      location: '',
      category: [],
      level: [],
      page: 1,
      results: [],
    };
    this.categories = [
      'Account Management',
      'Business & Strategy',
      'Creative & Design',
      'Customer Service',
      'Data Science',
      'Editorial',
      'Education',
      'Engineering',
      'Finance',
      'Fundraising & Development',
      'Healthcare & Medicine',
      'HR & Recruiting',
      'Legal',
      'Marketing & PR',
      'Operations',
      'Project & Product Management',
      'Retail',
      'Sales',
      'Social Media & Community'
    ];
    this.experienceLevels = [
      'Internship',
      'Entry Level',
      'Mid Level',
      'Senior Level'
    ];
  }

  cleanSearchResults (data) {
    const cleaned = data.map((listing) => {
      const cleanResult = {
        name: listing.name,
        company: listing.company.name,
        description: listing.contents,
        link: listing.refs.landing_page,
      };
      return cleanResult;
    });
    return cleaned;
  }

  getJobs (query) {
    const url = `https://api-v2.themuse.com/jobs?${query}`;
    request.get(url).then((data) => {
      const results = data.body.results;
      const cleanResults = this.cleanSearchResults(results);
      this.setState({
        company: '',
        location: '',
        category: [],
        level: [],
        page: 1,
        results: cleanResults,
      });
    });
  }

  handleChange (e) {
    const input = e.target;
    const inputName = input.getAttribute('name');
    const updated = {};
    updated[inputName] = input.value;
    this.setState(updated);
  }

  handleCheckbox (e) {
    const name = e.target.name;
    const stateClone = this.state[name];
    const value = e.target.value.replace('_', ' ');
    if (e.target.checked) {
      stateClone.push(value);
    }
    else if (!e.target.checked) {
      stateClone.forEach((option, idx) => {
        if (option === value) {
          stateClone.delete(idx);
        }
      });
    }
    const updated = {};
    updated[name] = stateClone;
    this.setState(updated);
  }

  formatForQuery (string) {
    string = string.replace(' ', '+');
    string = string.replace('&', '%26');
    string = string.replace('/', '+%2F+');
    string = string.replace(',' '%2C');
    return string;
  }

  generateQuerySubstring (filterArray, filterType) {
    let substring = '';
    filterArray.forEach((string) => {
      if (string !== '') {
        const formattedString = `${filterType}=${formatForQuery(string)}&`;
        substring = substring.concat(formattedString);
      }
    });
    return substring;
  }

  generateQueryString (input) {
    const {companyFilters, locationFilters, categoryFilters, levelFilters, page} = input;
    let query = '';
    const companies = this.generateQuerySubstring(companyFilters, 'company');
    const locations = this.generateQuerySubstring(locationFilters, 'location');
    const categories = this.generateQuerySubstring(categoryFilters, 'category');
    const levels = this.generateQuerySubstring(levelFilters, 'level');
    const pages = `page=${page}`;
    query = query.concat(companies, locations, categories, levels, pages);
    return query;
  }

  handleSubmit () {
    const {company, location, category, level, page} = this.state;
    const companyFilters = company.split(', ');
    const locationFilters = location.split('; ');
    const categoryFilters = category.map((cat) => {
      if (cat) {
        return cat;
      }
    });
    const levelFilters = level.map((lvl) => {
      if (lvl) {
        return lvl;
      }
    });
    const query = this.generateQueryString({companyFilters, locationFilters, categoryFilters, levelFilters, page});
    this.getJobs(query);
  }

  render () {
    return (
      <div>
       <h1>Search Job Listings</h1>
       <input type='text'
              name='page'
              placeholder='Pages of results to display (required)'
              onChange={this.handleChange} />
        <h3>Category</h3>
        <CheckboxForm queryType='category'
                      options={this.categories}
                      handleChange={this.handleCheckbox} />
        <h3>Experience Level</h3>
        <CheckboxForm queryType='level'
                      options={this.experienceLevels}
                      handleChange={this.handleCheckbox} />
        <h3>Company</h3>
        <input type='text'
              name='company'
              placeholder='Separate with commas'
              onChange={this.handleChange} />
        <h3>Location</h3>
        <input type='text'
               name='location'
               placeholder='City, US State or Country;'
               onChange={this.handleChange} />
        <input type='submit' text='Search' onClick={this.handleSubmit}>
        <JobsList results={this.state.results} />
      </div>
    );
  }
}
