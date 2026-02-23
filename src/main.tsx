import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"

import HomePage from "./pages/home/App.tsx"
import CreateWirdPage from "./pages/create-wird/App.tsx"

import "./index.scss"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="missed-prayers-tracker-app">
					<Route index element={<HomePage />} />
					<Route path="create/wird" element={<CreateWirdPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>,
)