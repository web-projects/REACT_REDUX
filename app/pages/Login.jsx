import React, { Component } from 'react';

export default class Login extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <section className="form-simple">
            <div id="loginSphere" className="row vh-100 mx-0">
              <div id="loginSphereLeft" className="col-lg-5 col-md-5 light-green white-text text-center">
                <div className="wow animated fadeInLeft login-main-content-green row justify-content-center">
                  <div className="col-md-9 my-3">
                    <div className="col-md-6 col-sm-6 col-6 mx-auto">
                      <img className="img-fluid loginSphereLogo" src="/resources/LogoSphere_white_sphere.png" alt="Sphere Logo" />
                    </div>
                    <div className="d-none d-sm-inline-block">
                      <p className="my-3 font-small">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem repellendus quasi fuga
                        nesciunt dolorum nulla magnam veniam sapiente, fugiat!
                      </p>
                      <a href="/login" className="btn btn-outline-white ml-0 waves-effect waves-light z-depth-0">Learn More</a>
                    </div>
                  </div>
                </div>
              </div>
              <div id="loginSphereRight" className="col-lg-7 col-md-7 wow animated fadeInRight">
                <div className="login-main-content row justify-content-center">
                  <div className="col-md-7 my-5">
                    <div className="header">
                      <div className="d-flex justify-content-center">
                        <h3 className="mb-0 pb-2 login-header text-center font-weight-bold">Welcome back to Sphere</h3>
                      </div>
                    </div>

                    <div id="loginForm">
                      <div className="row mx-0">
                        <div id="loginEmailContainer">
                          <h6 className="my-3 text-center">Sign in to get started</h6>
                          <div className="md-form">
                            <input type="email" id="login-email" className="form-control validate mb-0" />
                            <label htmlFor="login-email" data-error="wrong" data-success="right">Email Address</label>
                          </div>
                        </div>

                        <div id="loginPasswordContainer">
                          <h6 className="my-3 text-center">
                            <button type="button" id="loginBackButton" className="my-0 py-1 btn z-depth-0">
                              <i className="fas fa-arrow-circle-left mr-1" />
                              {' '}
                              Sign in to
                              {' '}
                              <span className="light-green-text" id="login-email-text" />
                              {' '}
                              ?
                            </button>
                          </h6>
                          <div className="md-form mt-0">
                            <input type="password" id="login-password" className="form-control" />
                            <label htmlFor="login-password">Password</label>
                          </div>
                        </div>
                      </div>
                      <div id="loginFormBottom" className="d-flex justify-content-between mb-4">
                        <div>
                          <input type="checkbox" className="form-check-input" id="login-rememberme" />
                          <label className="form-check-label font-small grey-text" htmlFor="login-rememberme">Remember me</label>
                        </div>
                        <div id="textForgotPassword" className="font-small grey-text">
                          Forgot
                          {' '}
                          <a href="/forgot-password" className="light-green-text font-weight-bold">Password?</a>
                        </div>
                      </div>
                      <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-8">
                          <button type="submit" id="loginSubmit" className="btn light-green text-white z-depth-1 waves-effect btn-block">Continue</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
    }
}
