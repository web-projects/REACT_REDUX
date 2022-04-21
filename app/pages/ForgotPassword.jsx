import React, { Component } from 'react';

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className="form-simple">
                <div id="loginSphere" className="row vh-100 mx-0">
                    <div id="forgotPasswordBanner" className="col-lg-5 col-md-5 light-green white-text text-center">
                        <div className="row justify-content-center">
                            <div className="col-md-9 my-3">
                                <div className="col-md-6 col-sm-6 col-6 mx-auto">
                                    <img className="img-fluid loginSphereLogo" src="LogoSphere_white_sphere.png" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="loginSphereLeft" className="col-lg-7 col-md-7 wow animated fadeInRight">
                        <div className="login-main-content row justify-content-center">
                            <div className="col-md-7 my-5">
                                <div className="header">
                                    <div className="d-flex justify-content-center">
                                        <h3 className="mb-0 pb-2 login-header text-center font-weight-bold">Forgot Password?</h3>
                                    </div>
                                    <p className="mt-3 mb-0 font-small text-center">
                                        Enter the email address associated with your account. We will send you an email to help reset your password and recover your account.
                                        If you are having difficulty entering email, please <a className="light-green-text" href="#">contact support</a> for assistance.
                                    </p>
                                </div>

                                <div id="forgotpasswordForm" className="mb-3">
                                    <div className="md-form mt-2">
                                        <input type="email" id="login-email" className="form-control validate mb-0" />
                                        <label for="login-email" data-error="wrong" data-success="right">Email Address</label>
                                    </div>

                                    <div className="row justify-content-center">
                                        <div className="col-xl-7 col-lg-8 col-md-10">
                                            <button type="submit" id="forgotpasswordSubmit" className="btn light-green text-white z-depth-1 waves-effect btn-block">Reset Password</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="loginSphereRight" className="d-none d-md-inline-block col-lg-5 col-md-5 light-green white-text text-center">
                        <div className="wow animated fadeInLeft login-main-content-green row justify-content-center">
                            <div className="col-md-9">
                                <div className=" my-3 col-md-6 col-sm-6 col-6 mx-auto">
                                    <img className="img-fluid loginSphereLogo" src="LogoSphere_white_sphere.png" />
                                </div>
                                <p className="my-3 font-small">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem repellendus quasi fuga
                                    nesciunt dolorum nulla magnam veniam sapiente, fugiat!
                                </p>
                                <a className="btn btn-outline-white ml-0 waves-effect waves-light z-depth-0">Learn More</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}