import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "./components/App";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
	<div>
		<MuiThemeProvider>
			<div>
				<App />
			</div>
		</MuiThemeProvider>
	</div>,
	document.getElementById("react-app")
);
