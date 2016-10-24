import React from 'react';

const propTypes = {
  results: React.PropTypes.object,
};

export default const JobsList = () => (
  <div id='jobs-list'>
    {this.props.results.map((job) => {
      return (
        <div className='job-display'>

        </div>
      );
    })}
  </div>
);

JobsList.propTypes = propTypes;
