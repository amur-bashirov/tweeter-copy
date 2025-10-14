import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields/AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserHooks";
import { LoginView, LoginPresenter } from "../../../presenters/LoginPresenter";

export interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const { updateUser } = useUserInfoActions();
  const {  displayErrorMessage } = useMessageActions();


  const view: LoginView = {
    setIsLoading: setIsLoading,
    displayErrorMessage: displayErrorMessage,
    updateUser: updateUser
  };
  
  const presenterRef = useRef<LoginPresenter | null>(null);
    if (!presenterRef.current) {
      presenterRef.current = new LoginPresenter(view);
    }

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin(alias, password, props, rememberMe);
    }
  };

  const doLogin = async (
    alias: string,
    password: string,
    props: Props,
    rememberMe: boolean
  ) => {
    presenterRef.current!.doLogin(alias, password, props, rememberMe)
  };

  const inputFieldFactory = () => {
    return (
    <AuthenticationFields
      alias={alias}
      setAlias={setAlias}
      password={password}
      setPassword={setPassword}
      onEnter={loginOnEnter}
    />
  );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={() => doLogin(alias, password, props, rememberMe)}
    />
  );
};

export default Login;
