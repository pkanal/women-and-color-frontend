// NPM
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControlLabel, FormHelperText } from 'material-ui/Form';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// App
import {
  update as updateProfile,
  onChange as onChangeProfile,
} from 'appRedux/modules/profile';
import {
  get as getTopics,
  create as createTopic,
} from 'appRedux/modules/topic';
import { showNotification } from 'appRedux/modules/notification';
import StyledButton from 'appCommon/StyledButton';
import FormField from 'appCommon/FormField';
import TopicSelector from 'appPages/EditProfile/FormComponents/TopicSelector/TopicSelector';
import css from '../styles.css';

const CURRENT_PAGE = 'work';

const Work = props => {
  const generateHandler = fieldName => {
    return event => {
      props.handleProfileInputChange(fieldName, event.currentTarget.value);
    };
  };

  const handleTopicsChange = topics => {
    props.handleProfileInputChange('topics', topics);
  };

  return (
    <div className={css.registrationForm}>
      <form onSubmit={props.handleSubmit}>
        <h1 className={css.registrationFormHeader}>Let's talk about work</h1>

        <FormField fullWidth className={css.formControl}>
          <TextField label="Position" onChange={generateHandler('position')} />
        </FormField>

        <FormField fullWidth className={css.formControl}>
          <TextField
            label="Organization"
            onChange={generateHandler('organization')}
          />
        </FormField>

        <FormField fullWidth className={css.formControl}>
          <FormLabel component="legend">Speaking Topics</FormLabel>
          <TopicSelector
            topics={props.topics}
            selectedTopics={props.profile.topics}
            handleChange={handleTopicsChange}
            createTopic={props.createTopic}
          />
          <FormHelperText>
            {`Topics: ${props.profile.topics.length || '0'} of 10`}
          </FormHelperText>
        </FormField>

        <div>
          <FormField className={css.formControl}>
            <StyledButton label="Submit" type="submit" color="primary">
              Save and continue
            </StyledButton>
          </FormField>
        </div>
      </form>
    </div>
  );
};

class WorkContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    props.getTopics();
    props.onChangeProfile({ current_page: CURRENT_PAGE });
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Get started - Work</title>
          <meta
            name="description"
            content="Create your profile on Women and Color"
          />
        </Helmet>
        <Work
          handleSubmit={event => {
            event.preventDefault();
            if (this.props.profile.topics.length < 1) {
              return this.props.showNotification(
                'Please enter at least one topic.'
              );
            }
            this.props.updateProfile();
          }}
          handleProfileInputChange={(field, value) => {
            this.props.onChangeProfile({ [field]: value });
          }}
          {...this.props}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    profile: state.profile,
    topics: state.topic.topics,
  };
}

function mapDispatchToProps(dispatch, props) {
  return {
    onChangeProfile: attrs => {
      dispatch(onChangeProfile(attrs));
    },
    updateProfile: () => {
      dispatch(updateProfile());
    },
    getTopics: () => {
      dispatch(getTopics());
    },
    createTopic: topic => {
      dispatch(createTopic(topic));
    },
    showNotification: message => {
      dispatch(showNotification(message));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkContainer);
