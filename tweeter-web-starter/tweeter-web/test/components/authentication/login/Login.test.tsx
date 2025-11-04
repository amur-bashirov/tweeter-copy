import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login"
import { render, screen} from "@testing-library/react"
import {userEvent} from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {instance, mock, verify} from "@typestrong/ts-mockito"
import { LoginPresenter } from "../../../../src/presenters/LoginPresenter";

library.add(fab)

describe("Login Component", () => {

    it("starts with the sign-in button disabled", () => {
        const {signInButton} = renderLoginAndGetElement("/")
        expect(signInButton).toBeDisabled();
    })

    it("enable the sign in button if both alias and password fields have text", async () => {
        const {signInButton, aliasField, passwordField, user} = renderLoginAndGetElement("/")

        await user.type(aliasField, "a");
        await user.type(passwordField,"b");

        expect(signInButton).toBeEnabled();

    })

    it("disables the sign in button if eight passowrd or alias fields are cleared", async () => {
        const {signInButton, aliasField, passwordField, user} = renderLoginAndGetElement("/")


        await user.type(aliasField, "a");
        await user.type(passwordField,"b");


        expect(signInButton).toBeEnabled();

        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();

        await user.type(aliasField,"a");
        expect(signInButton).toBeEnabled();

        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();
       
    })


    it("calls the presenters's login method with the correct parameters when the sing in button is pressed", async() => {
        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInctance = instance(mockPresenter);


        const originalUrl = "http://somwhere.com"
        const alias = "@alias";
        const password = "@password"
        const rememberMe = false
        const {signInButton, aliasField, passwordField, user} = 
        renderLoginAndGetElement(originalUrl, mockPresenterInctance)

        await user.type(aliasField, alias);
        await user.type(passwordField,password);

        
        await user.click(signInButton);
            

        verify(mockPresenter.doLogin(alias, password,originalUrl, rememberMe)).once();
    })

})

function renderLogin(originalUrl: string, presenter?: LoginPresenter){
    return render(
        <MemoryRouter>
            {!! presenter ? (<Login originalUrl={originalUrl} presenter={presenter}/>): (<Login originalUrl={originalUrl} />)}
        </MemoryRouter>
    );
}

function renderLoginAndGetElement(originalUrl: string, presenter?: LoginPresenter){
    const user = userEvent.setup();
    renderLogin(originalUrl, presenter);

    const signInButton = screen.getByRole("button", {name: /Sign in/i});
    const aliasField = screen.getByLabelText("alias");
    const passwordField = screen.getByLabelText("password");


    return {user, signInButton, aliasField, passwordField}
}