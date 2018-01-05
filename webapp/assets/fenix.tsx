import * as React from "react";
import * as ReactDOM from "react-dom";

import { AppFenix } from "./fenix/AppFenix";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
	<div>
		<MuiThemeProvider>
			<div>
				<AppFenix />
			</div>
		</MuiThemeProvider>
	</div>,
	document.getElementById("react-app")
);
