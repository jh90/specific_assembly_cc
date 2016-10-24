import React from 'react';

const propTypes = {
  queryType: React.PropTypes.string,
  options: React.PropTypes.array,
  handleChange: React.PropTypes.func,
};

export default const CheckboxForm = () => (
      <div className={`checkbox ${this.props.queryType}`}>
        {this.props.options.map((option) => {
          return (
            <input type='checkbox'
                   name={this.props.queryType}
                   value={option.replace(' ', '_')}
                   onChange={this.props.handleChange} />
            {option}</br>
          );
        })}
      </div>
    );

CheckboxForm.propTypes = propTypes;
