import { useEffect, useRef, useState } from "react";
import { ConnectButton } from "360dialog-connect-button";
import Head from "next/head";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";
import prism from "react-syntax-highlighter/dist/cjs/styles/prism/prism";
import { dedent } from "ts-dedent";
import { useRouter } from "next/router";

SyntaxHighlighter.registerLanguage("jsx", jsx);

type CallbackObjectType = {
  client: string;
  channels: string[];
  revokedChannels?: string[];
};

type QueryParametersType = {
  email: string;
  clientName: string;
  partnerPayload: string;
  redirectUrl: string;
  forwardState: string;
  next: string
};

const demoPartnerId = "f167CmPA";

export default function Home() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [showScrollLabel, setshowScrollLabel] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollContainerHeight, setScrollContainerHeight] =
    useState<number>(2000);

  const [partnerId, setPartnerId] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [queryParametersState, setQueryParamatersState] =
    useState<QueryParametersType>({
      email: "",
      clientName: "",
      partnerPayload: "",
      redirectUrl: "",
      forwardState: "",
      next: ""
    });
  const [callbackObject, setcallbackObject] = useState<CallbackObjectType>();
  const [copied, setCopied] = useState<boolean>(false)

  const router = useRouter();
  const { id } = router.query;

  const handleQueryParameterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setQueryParamatersState((queryParametersState) => ({
      ...queryParametersState,
      [name]: value,
    }));
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setQueryParamatersState((queryParametersState) => ({
      ...queryParametersState,
      [name]: checked ? "login" : "",
    }));
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timeoutCopied = window.setTimeout(() => {
        setCopied(false)
    }, 5000);

    return () => window.clearTimeout(timeoutCopied );
  }, [copied])

  const handleCallback = (callbackObject: CallbackObjectType) => {
    /* The callback function returns the client ID as well as all channel IDs, for which you're enabled to fetch the API key via the Partner API */

    if (mounted) {
      setcallbackObject(callbackObject);

      console.log("Client ID: " + callbackObject.client);
      console.log("Channel IDs: " + callbackObject.channels);
      if (callbackObject.revokedChannels) {
        console.log("Revoked Channel IDs: " + callbackObject.revokedChannels);
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).scrollTop < 10) {
      setshowScrollLabel(true);
    } else {
      setshowScrollLabel(false);
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current != null) {
      setScrollContainerHeight(scrollContainerRef.current.clientHeight - 65);
    }

    // Set partner id from query parameter
    if (id) {
      setPartnerId(id as string);
    }
  }, [id]);


  const returnQueryParameterLiteral = () => {
  
    const parameters = [
      { stateVar: "email", queryParam: "email" },
      { stateVar: "clientName", queryParam: "name" },
      { stateVar: "partnerPayload", queryParam: "partner" },
      { stateVar: "forwardState", queryParam: "state" },
      { stateVar: "redirectUrl", queryParam: "redirect_url" },
      { stateVar: "next", queryParam: "next" },
    ];

    var literalStringArr: string[] = [];

    parameters.forEach((v, idx) => {
      if (
        queryParametersState[v.stateVar as keyof QueryParametersType] !== ""
      ) {
        literalStringArr.push(
          `${v.queryParam}: "${
            queryParametersState[v.stateVar as keyof QueryParametersType]
          }"`
        );
      }
    });

    if (literalStringArr.length > 0) {
      return (`queryParameters={{\n\t${literalStringArr.join(",\n\t")}\n}}`);
    } else {
      return ``
    }
    
  };


  const generateCodeSnippet = ():string => {
    let textBase = dedent(
      `<ConnectButton
        partnerId={${partnerId}}
        callback={() => {
          console.log("Client ID: " + callbackObject.client);
          console.log("Channel IDs: " + callbackObject.channels);
          if (callbackObject.revokedChannels) {
            console.log("Revoked Channel IDs: " + callbackObject.revokedChannels);
          }
        }}
        className="" // <-- Insert your own styles via className definition or through inline styling
        label="${label ? label : "Create your WhatsApp Business Account"}"
        `
    );

    if (number) {
      textBase = textBase.concat(`\nrequestedNumber="${number}"`)
    }

    const parameters = [
      { stateVar: "email", queryParam: "email" },
      { stateVar: "clientName", queryParam: "name" },
      { stateVar: "partnerPayload", queryParam: "partner" },
      { stateVar: "forwardState", queryParam: "state" },
      { stateVar: "redirectUrl", queryParam: "redirect_url" },
    ];

    var literalStringArr: string[] = [];

    parameters.forEach((v) => {
      if (
        queryParametersState[v.stateVar as keyof QueryParametersType] !== ""
      ) {
        literalStringArr.push(
          `${v.queryParam}: "${
            queryParametersState[v.stateVar as keyof QueryParametersType]
          }",`
        );
      }
    });

    let queryParams = returnQueryParameterLiteral();
    if (queryParams !== ``) {
      textBase = textBase.concat("\n", queryParams)
    }
  
    return textBase.concat( "\n/>")
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Head>
        <title>360dialog IO Demo</title>
        <meta
          name="description"
          content="360dialog Integrated Onboarding Demo Application"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen h-screen flex flex-col overflow-hidden">
        <Header />

//Norbu
            <div className="flex flex-col grow pr-6 overflow-auto">
              <div className="flex flex-col grow">
                <p className="text-md font-bold text-gray-700 flex-none">
                  Preview
                </p>
                <div className="mt-2 p-6 bg-dots rounded-md grow border border-gray-100 relative">
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    {mounted && (
                      <>
                        <ConnectButton
                          disabled={!partnerId}
                          partnerId={partnerId}
                          className="bg-gray-800 text-white hover:bg-gray-900 drop-shadow-xl rounded-md px-4 py-3 outline-none focus:ring focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                          label={
                            label
                              ? label
                              : "Create your WhatsApp Business Account"
                          }
                          callback={handleCallback}
                          env={partnerId === demoPartnerId ? "staging" : "prod"}
                          requestedNumber={number}
                          queryParameters={{
                            redirect_url: queryParametersState.redirectUrl
                              ? queryParametersState.redirectUrl
                              : window.origin,
                            ...(queryParametersState.forwardState && {
                              state: queryParametersState.forwardState,
                            }),
                            ...(queryParametersState.email && {
                              email: queryParametersState.email,
                            }),
                            ...(queryParametersState.clientName && {
                              name: queryParametersState.clientName,
                            }),
                            ...(queryParametersState.partnerPayload && {
                              partner: queryParametersState.partnerPayload,
                            }),
                            ...(queryParametersState.next && {
                              next: queryParametersState.next,
                            }),
                          }}
                        />
                        {!partnerId && (
                          <p className="absolute bottom-2 mt-1 text-xs text-red-600">
                            Please add a Partner ID to enable button
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col grow pt-6">
                <div className="flex flex-row items-baseline justify-between w-full pb-2">
                  <p className="text-md font-bold text-gray-700 flex-none">
                    Connect Button Code
                  </p>
                  <a
                    className="text-sm text-blue-600 px-3 py-1 outline-none hover:text-blue-800 flex flex-row items-center gap-2"
                    href="https://www.npmjs.com/package/360dialog-connect-button"
                    target="_blank"
                    rel="noreferrer"
                  >
                    NPM Package Docs
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                        clip-rule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
                <div className="relative bg-gray-50 rounded-md grow text text-gray-900 text-sm">
                  {mounted && (
                    <SyntaxHighlighter
                      language="jsx"
                      style={prism}
                      customStyle={{ background: "transparent" }}
                      className="w-full h-full p-6 max-w-xs lg:max-w-md xl:max-w-lg 2xl:max-w-full m-0"
                    >
                      {generateCodeSnippet()}
                    </SyntaxHighlighter>
                  )}
                  <div className="absolute top-3 right-3">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(generateCodeSnippet());
                        setCopied(true);
                      }}
                      outlined
                    >
                      {copied ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                            />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                            />
                          </svg>
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col w-1/4 max-w-xl">
              <p className="text-md font-bold text-gray-700 flex-none">
                Console
              </p>
              <div className="mt-2 p-6 bg-gray-800 rounded-md grow text text-white font-mono text-sm">
                {callbackObject ? (
                  <div className="pb-8">
                    <p>Client ID: {callbackObject.client}</p>
                    <p>Channel IDs: {callbackObject.channels.join(", ")}</p>
                    {callbackObject.revokedChannels && (
                      <p>
                        Revoked Channel IDs: {callbackObject.revokedChannels}
                      </p>
                    )}
                  </div>
                ) : (
                  `>_`
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



