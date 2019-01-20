import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import {
  ScrollView,
  View,
} from 'react-native';
import { Icon } from 'expo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
  Appbar,
  Switch,
  Text,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';

import styles from '../theme/styles';
import DeleteButton from '../components/DeleteButton';

class EditJobScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      showDateTimePicker: {
        clockIn: false,
        clockOut: false
      }
    };
  }

  componentWillMount() {
    const { navigation } = this.props;
    const id = _.get(navigation.state, 'params.id', null);
    this.props.jobsActions.getJob(id);
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  updateValue = (key, value) => {
    this.props.jobsActions.updateJob(key, value);
  }

  showDateTimePicker = (key) => {
    const { showDateTimePicker } = this.state;
    showDateTimePicker[key] = true;
    this.setState({
      showDateTimePicker
    });
  }

  hideDateTimePicker = (key) => {
    const { showDateTimePicker } = this.state;
    showDateTimePicker[key] = false;
    this.setState({
      showDateTimePicker
    });
  }

  confirmDate = (key, date) => {
    const time = moment(date).format('HH:mm');
    this.updateValue(key, time);
    this.hideDateTimePicker(key);
  }

  cancelDate = (key) => {
    this.hideDateTimePicker(key);
  }

  saveJob = () => {
    this.props.jobsActions.saveJob().then(() => {
      this.goBack();
    }).catch((error) => {
      console.log(error);
    });
  }

  deleteJob = async () => {
    await this.props.jobsActions.deleteJob();
    this.props.navigation.navigate('Jobs');
  }

  renderDeleteButton = () => {
    const { job } = this.props.jobs;
    if (!job.id) {
      return null;
    }
    return (
      <DeleteButton onPress={this.deleteJob} />
    );
  }

  render() {
    const { job } = this.props.jobs;
    if (!job) {
      return null;
    }

    const { colors } = this.props.theme;

    const title = job.id ? 'Edit Job' : 'New Job';

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>

        <Appbar.Header>
          <Appbar.BackAction onPress={this.goBack} />
          <Appbar.Content
            title={title}
          />
          <Appbar.Action icon="check" onPress={this.saveJob} />
        </Appbar.Header>

        <KeyboardAwareScrollView>
          <View style={styles.form}>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <View style={styles.control}>
                <TextInput
                  mode="outlined"
                  onChangeText={_.partial(this.updateValue, 'name')}
                  onSubmitEditing={() => { this.rateTextInput.focus(); }}
                  ref={(input) => { this.nameTextInput = input; }}
                  returnKeyType="next"
                  value={job.name}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Rate</Text>
              <View style={styles.control}>
                <TextInput
                  keyboardType="decimal-pad"
                  mode="outlined"
                  onChangeText={_.partial(this.updateValue, 'rate')}
                  ref={(input) => { this.rateTextInput = input; }}
                  returnKeyType="done"
                  value={`${job.rate || ''}`}
                />
              </View>
            </View>

            <View style={[styles.formGroup, styles.formGroupAcross]}>
              <Text style={styles.label}>Clock In</Text>
              <TouchableRipple
                onPress={_.partial(this.showDateTimePicker, 'clockIn')}
              >
                <View style={styles.textValueGroup}>
                  <Text style={styles.textValue}>{job.clockInString}</Text>
                  <Icon.Ionicons
                    color={colors.text}
                    name="ios-time"
                    size={24}
                    style={styles.textValueGroupIcon}
                  />
                  <DateTimePicker
                    date={job.clockInDate}
                    isVisible={this.state.showDateTimePicker.clockIn}
                    mode="time"
                    onConfirm={_.partial(this.confirmDate, 'clockIn')}
                    onCancel={_.partial(this.cancelDate, 'clockIn')}
                  />
                </View>
              </TouchableRipple>
            </View>

            <View style={[styles.formGroup, styles.formGroupAcross]}>
              <Text style={styles.label}>Clock Out</Text>
              <TouchableRipple
                onPress={_.partial(this.showDateTimePicker, 'clockOut')}
              >
                <View style={styles.textValueGroup}>
                  <Text style={styles.textValue}>{job.clockOutString}</Text>
                  <Icon.Ionicons
                    color={colors.text}
                    name="ios-time"
                    size={24}
                    style={styles.textValueGroupIcon}
                  />
                  <DateTimePicker
                    date={job.clockOutDate}
                    isVisible={this.state.showDateTimePicker.clockOut}
                    mode="time"
                    onConfirm={_.partial(this.confirmDate, 'clockOut')}
                    onCancel={_.partial(this.cancelDate, 'clockOut')}
                  />
                </View>
              </TouchableRipple>
            </View>

            <View style={[styles.formGroup, styles.formGroupAcross]}>
              <Text style={styles.label}>Shift Duration</Text>
              <View style={styles.control}>
                <Text style={styles.textValue}>{job.durationString}</Text>
              </View>
            </View>

            <View style={[styles.formGroup, styles.formGroupAcross]}>
              <Text style={styles.label}>Defualt</Text>
              <View style={styles.control}>
                <Switch
                  onValueChange={_.partial(this.updateValue, 'defaultJob')}
                  value={job.defaultJob}
                />
              </View>
            </View>


          </View>
        </KeyboardAwareScrollView>

        <View style={styles.buttonRow}>
          {this.renderDeleteButton()}
        </View>
      </View>
    );
  }
}

export default EditJobScreen;
