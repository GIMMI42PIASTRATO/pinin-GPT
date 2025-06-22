import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
	const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
		undefined
	);

	React.useEffect(() => {
		// Crea una MediaQueryList (mql), che è un oggeto, sul quale è possbile verificare se la MediaQuery specificata in matchMedia corrisponde
		const mql = window.matchMedia(
			`(max-width: ${MOBILE_BREAKPOINT - 1}px)`
		);
		const onChange = () => {
			// TODO: Al posto di fare il controllo mauale, è posbbile utilizzare `mql.matches`, che applica la `MediaQuery` specificata come argomento di `window.matchMedia`. Sarebbe più coretto utilizzarlo
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	return !!isMobile;
}
