import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import _ from 'lodash';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import PatientDetails from '../../components/PatientDetails';
import HealthInfoNav from '../../components/HealthInfoNav';
import HealthInformation from '../../components/HealthInformation';
import dayGrouper from '../../components/common/HealthInfo/DaywiseGroup';
import AlertBox from '../../components/AlertBox';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';

const renderHealthInfo = (
  patientData,
  dates,
  selectedDate,
  onChange,
  reqID,
  healthInfo
) => (
  <>
    <PatientDetails patientData={patientData} />
    <HealthInfoNav
      dates={dates}
      selectedDate={selectedDate}
      setSelectedDate={onChange}
    />
    <HealthInformation
      consentReqId={reqID}
      healthInfo={healthInfo}
      selectedDate={selectedDate}
    />
  </>
);

const renderErrorMessage = () => (
  <AlertBox type="error" title="Error" message="Sorry! Couldn't fetch data." />
);

const renderNoInfoMessage = (patientData) => (
  <>
    <PatientDetails patientData={patientData} />
    <AlertBox
      type="info"
      title="No Information"
      message="Health information is unavailable for requested patient!"
    />
  </>
);

const renderLoadingMessage = () => (
  <AlertBox
    type="info"
    title="Loading..."
    message="Fetching data. Please wait!"
  />
);

const PatientHealthInformation = ({
  loadHealthData,
  error,
  success,
  dateArray,
  defaultSelectedDate,
  healthInfo,
  patientData,
  erroredEntiresCount,
  match,
}) => {
  const isHealthInfoAvailable = !_.isEmpty(healthInfo);
  const areEntriesWithError = erroredEntiresCount > 0;
  const [selectedDate, setSelectedDate] = useState(defaultSelectedDate);
  const [snackbarOpen, setSnackbarOpen] = useState(areEntriesWithError);

  useEffect(() => {
    loadHealthData({ id: match.params.requestId, groupFunction: dayGrouper });
  }, []);

  useEffect(() => {
    setSelectedDate(defaultSelectedDate);
    setSnackbarOpen(areEntriesWithError);
  }, [defaultSelectedDate, areEntriesWithError]);

  const onChange = (newSelectedDate) => {
    setSelectedDate(newSelectedDate);
  };
  const handleSnackbarClose = () => setSnackbarOpen(false);

  let content = renderLoadingMessage();

  if (isHealthInfoAvailable) {
    content = renderHealthInfo(
      patientData,
      dateArray,
      selectedDate,
      onChange,
      match.params.id,
      healthInfo
    );
  } else if (error) {
    content = renderErrorMessage();
  } else if (success && !isHealthInfoAvailable) {
    content = renderNoInfoMessage(patientData);
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="warning"
          elevation={6}
          variant="filled"
        >
          Error in the data received from
          {` ${erroredEntiresCount} `}
          Health Information Providers!
        </Alert>
      </Snackbar>
      <Header />
      <Breadcrumb />
      {content}
    </div>
  );
};

PatientHealthInformation.propTypes = {
  success: PropTypes.bool,
  error: PropTypes.bool,
  dateArray: PropTypes.arrayOf(
    PropTypes.shape({
      resourceType: PropTypes.string,
    })
  ).isRequired,
  defaultSelectedDate: PropTypes.string.isRequired,
  healthInfo: PropTypes.shape(
    PropTypes.arrayOf(
      PropTypes.shape({
        data: PropTypes.arrayOf(
          PropTypes.shape({
            resourceType: PropTypes.string,
          })
        ).isRequired,
        hipId: PropTypes.string.isRequired,
        hipName: PropTypes.string.isRequired,
      })
    )
  ).isRequired,
  patientData: PropTypes.shape({
    id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
  loadHealthData: PropTypes.shape({
    id: PropTypes.string,
    groupFunction: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
      requestId: PropTypes.string.isRequired,
    }),
  }).isRequired,
  erroredEntiresCount: PropTypes.number.isRequired,
};

PatientHealthInformation.defaultProps = {
  success: false,
  error: false,
};

export default PatientHealthInformation;
