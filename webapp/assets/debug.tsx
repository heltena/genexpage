import * as React from "react";
import * as ReactDOM from "react-dom";

import { AppDebug } from "./components/AppDebug";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
	<div>
		<MuiThemeProvider>
			<div>
				<AppDebug />
			</div>
		</MuiThemeProvider>
	</div>,
	document.getElementById("react-app")
);
