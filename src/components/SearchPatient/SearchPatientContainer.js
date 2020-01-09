import React from "react";
import { connect } from "react-redux";
import SearchPatient from "./SearchPatient";
import { onSearch } from "./../../redux/actions/searchAction";

const mapStateToProps = state => ({
  patientId: state.patientDetail.result
});

const mapDispatchToProps = {
  onSearch
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchPatient);