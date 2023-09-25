/* eslint-disable @next/next/no-img-element */
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import Head from "next/head";
import { useState, useMemo, useEffect } from "react";

import { FaSpinner } from "react-icons/fa";

import { NFTStorage } from "nft.storage";
import { CID } from "multiformats/cid";

import { useToast } from "@/hooks/useToast";
import { useDebug } from "@/hooks/useDebug";

function convertCID(cidString: string) {
  try {
    const cid = CID.parse(cidString);

    if (cid.version === 0) {
      const v1 = cid.toV1().toString();
      return { v0: cidString, v1 };
    } else if (cid.version === 1) {
      const v0 = CID.parse(cidString).toV0().toString();
      return { v0, v1: cidString };
    }
  } catch (e) {
    return undefined;
  }
}

export default function HomePage() {
  const [cid, setCID] = useState(
    "bafybeidd2gyhagleh47qeg77xqndy2qy3yzn4vkxmk775bg2t5lpuy7pcu",
  );
  const [convertedCIDs, setConvertedCIDs] = useState<{
    v0: string;
    v1: string;
  }>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [viewMode, setViewMode] = useState<
    "select" | "check" | "backup" | "monitor"
  >("select");

  const [modalMode, setModalMode] = useState<
    | "check"
    | "select"
    | "nftstorage"
    | "nftstorage-confirm"
    | "lighthouse"
    | "lighthouse-confirm"
    | "job"
  >("nftstorage");
  const [nftStorageAPIKey, setNftStorageAPIKey] = useState(
    process.env.NEXT_PUBLIC_NFTSTORAGE_API_KEY || "",
  );
  const [lighthouseAPIKey, setLighthouseAPIKey] = useState(
    process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY || "",
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 1 week from now
  );
  const [replicationTarget, setReplicationTarget] = useState(1);
  const [epochs, setEpochs] = useState(16);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([
    "replication",
    "repair",
    "renewal",
  ]);
  const [jobId, setJobId] = useState("");

  const { debug, logTitle, isDebugStarted, logs } = useDebug();
  const { toast, showToast } = useToast();

  const [peerInfo, setPeerInfo] = useState<OutputData>();

  function modifyData(data: InputData): OutputData {
    const { MultihashResults } = data;
    let modifiedProviders: ModifiedProvider[] = [];

    MultihashResults.forEach((result) => {
      result.ProviderResults.forEach((providerResult) => {
        modifiedProviders.push({
          peerID: providerResult.Provider.ID,
          Multiaddress: providerResult.Provider.Addrs,
        });
      });
    });

    // Removing duplicates based on peerID
    modifiedProviders = modifiedProviders.reduce<ModifiedProvider[]>(
      (acc, current) => {
        const exists = acc.find((item) => item.peerID === current.peerID);
        if (!exists) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      },
      [],
    );

    return { modifiedProviders };
  }

  useMemo(() => {
    if (!convertedCIDs) {
      return;
    }
    fetch(`https://cid.contact/cid/${convertedCIDs.v1}`).then((response) => {
      response
        .json()
        .then((data) => {
          setPeerInfo(modifyData(data));
        })
        .catch((error) => {
          console.log("Error:", error.message);
        });
    });
  }, [convertedCIDs]);

  useMemo(() => {
    const converted = convertCID(cid);
    setConvertedCIDs(converted);
  }, [cid]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSelectedOptions((prevSelectedOptions) => {
      if (prevSelectedOptions.includes(value)) {
        // If the option is already selected, filter it out
        return prevSelectedOptions.filter((option) => option !== value);
      } else {
        // If the option is not selected, add it to the state
        return [...prevSelectedOptions, value];
      }
    });
  };

  useEffect(() => {
    if (isDebugStarted || isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto"; // or 'visible' if you want
    }
    return () => {
      document.body.style.overflow = "auto"; // reset on unmount
    };
  }, [isDebugStarted, isModalOpen]);

  const JobStatus = ({ jobId }: { jobId: string }) => {
    const [jobStatus, setJobStatus] = useState<{
      currentActiveDeals: string[];
      epochs: number;
      jobType: string;
      replicationTarget: number;
    }>();

    useEffect(() => {
      fetch(
        process.env.NEXT_PUBLIC_SERVICE_URL +
          "/api/deal_status" +
          "?cid=" +
          jobId,
      ).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setJobStatus(data);
          });
        }
      });
    }, [jobId]);

    return (
      <div>
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Job Status</h2>
        </div>
        <div className="mb-4">
          <label className="block text-black text-sm font-bold mb-2">
            JobId
          </label>
          <p className="text-xs">{jobId}</p>
        </div>
        <div className="mb-4">
          <label className="block text-black text-sm font-bold mb-2">
            Job Manger Key
          </label>
          <p className="text-xs">
            <a
              href={
                "https://calibration.filscan.io/en/address/0x00000c9b10039702e0587E587623f6a6786e4F7B/"
              }
              target="_blank"
              className="text-blue-600"
            >
              {"0x00000c9b10039702e0587E587623f6a6786e4F7B"}
            </a>
          </p>
        </div>
        <div className="mb-4">
          <label className="block text-black text-sm font-bold mb-2">
            Job Status Contract
          </label>
          <p className="text-xs">
            <a
              href={
                "https://calibration.filscan.io/en/address/0xc13316e2Fd1f0d5637BCEEEc1a41a3d9B2506B90/"
              }
              target="_blank"
              className="text-blue-600"
            >
              {"0xc13316e2Fd1f0d5637BCEEEc1a41a3d9B2506B90"}
            </a>
          </p>
        </div>
        {!jobStatus && (
          <div className="border p-4 my-2 rounded shadow-sm bg-gray-50 flex items-center justify-center">
            <div>
              <p className="text-center font-medium text-gray-600 mb-2">
                Job not found
              </p>
              <p className="text-center text-sm text-gray-500">
                {`It seems the job you're looking for doesn't exist or has been
                removed.`}
              </p>
            </div>
          </div>
        )}
        {jobStatus && (
          <>
            <div className="border p-4 my-2 rounded shadow-sm bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Replication Job Status</h3>
                {jobStatus.currentActiveDeals.length <
                  jobStatus.replicationTarget && (
                  <span className="text-xs py-1 px-2 rounded bg-gray-200 text-gray-700">
                    Processing
                  </span>
                )}
                {jobStatus.currentActiveDeals.length >=
                  jobStatus.replicationTarget && (
                  <span className="text-xs py-1 px-2 rounded bg-green-200 text-green-700">
                    Processed
                  </span>
                )}
              </div>
              <p className="mb-2 text-sm">
                Executing replication job to {jobStatus.replicationTarget}{" "}
                replications.
              </p>
              <p className="text-sm">
                Currently replications at {jobStatus.currentActiveDeals.length}/
                {jobStatus.replicationTarget}.
              </p>
            </div>
            <div className="border p-4 my-2 rounded shadow-sm bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Renew Job Status</h3>
                <span className="text-xs py-1 px-2 rounded bg-green-200 text-green-700">
                  No Issue
                </span>
              </div>
              <p className="text-sm">
                Executing renewal job every {jobStatus.epochs} epochs.
              </p>
            </div>
            <div className="border p-4 my-2 rounded shadow-sm bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Repair Job Status</h3>
                <span className="text-xs py-1 px-2 rounded bg-green-200 text-green-700">
                  No Issue
                </span>
              </div>
              <p className="text-sm">
                Executing repair job every {jobStatus.epochs} epochs.
              </p>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className={`bg-gradient-to-br from-gray-700 to-gray-950 min-h-screen flex flex-col ${inter.className}`}
    >
      <Head>
        <title>IPFSure</title>
      </Head>
      <header className="py-4 px-4 flex justify-end items-center mb-12 sm:mb-24">
        <button
          disabled={true}
          className="bg-gradient-to-br from-gray-700 to-black text-white py-2 px-4 rounded hover:opacity-80 focus:outline-none transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-75"
        >
          Connect Wallet
        </button>
      </header>
      <div className="text-center px-4 mb-12 sm:mb-24">
        <h1 className="text-3xl sm:text-4xl text-white mb-4">IPFSure 🙆‍♂️</h1>
        <p className="text-lg sm:text-2xl text-gray-300">
          Ensure IPFS data integrity with check, backup, and monitoring
        </p>
      </div>
      <div className="flex-1 px-4 mb-12">
        <div className="flex flex-col items-center justify-center">
          {viewMode !== "select" && (
            <div className="absolute top-4 left-4">
              <button
                onClick={() => setViewMode("select")}
                className="bg-white p-2 rounded text-gray-600 hover:bg-gray-200 focus:outline-none transition-colors duration-150"
              >
                Home
              </button>
            </div>
          )}
          {viewMode === "select" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setViewMode("check")}
                className="bg-white p-6 rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-200 w-80 cursor-pointer"
              >
                <h2 className="text-lg font-bold text-center text-gray-700">
                  Check
                </h2>
                <p className="text-center text-gray-600 mt-2">
                  You can check the the scalability and resilience of your data
                  here.
                </p>
              </div>
              <div
                onClick={() => setViewMode("backup")}
                className="bg-white p-6 rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-200 w-80 cursor-pointer"
              >
                <h2 className="text-lg font-bold text-center text-gray-700">
                  Backup
                </h2>
                <p className="text-center text-gray-600 mt-2">
                  You can backup your content with NFTStorage or Lighthouse.
                </p>
              </div>
              <div
                onClick={() => setViewMode("monitor")}
                className="bg-white p-6 rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-200 w-80 cursor-pointer"
              >
                <h2 className="text-lg font-bold text-center text-gray-700">
                  Monitoring
                </h2>
                <p className="text-center text-gray-600 mt-2">
                  You can check advanced replication, repair, renewal status
                </p>
              </div>
            </div>
          )}
          {viewMode === "check" && (
            <div className="bg-white p-6 rounded-lg shadow-xl w-96 space-y-4 max-w-xl w-full mb-4">
              <h2 className="text-lg font-bold mb-4 text-center">
                Check CID Peers
              </h2>
              <div>
                <label className="block text-black text-sm font-bold mb-2">
                  Input CID
                </label>
                <input
                  type="text"
                  placeholder="Qm..."
                  value={cid}
                  onChange={(e) => setCID(e.target.value)}
                  className="shadow appearance-none border rounded w-full p-3 text-black leading-tight focus:outline-none text-xs"
                />
              </div>
              <div className="flex items-center justify-end">
                <button
                  disabled={!convertedCIDs}
                  onClick={() => {
                    setModalMode("check");
                    setIsModalOpen(true);
                  }}
                  className="bg-gradient-to-br from-gray-700 to-black text-white py-2 px-4 rounded hover:opacity-80 focus:outline-none transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-75"
                >
                  Start
                </button>
              </div>
            </div>
          )}
          {viewMode === "backup" && (
            <div className="bg-white p-6 rounded-lg shadow-xl w-96 space-y-4 max-w-xl w-full mb-4">
              <h2 className="text-lg font-bold mb-4 text-center">
                Create Backup
              </h2>
              <div>
                <label className="block text-black text-sm font-bold mb-2">
                  Input CID
                </label>
                <input
                  type="text"
                  placeholder="Qm..."
                  value={cid}
                  onChange={(e) => setCID(e.target.value)}
                  className="shadow appearance-none border rounded w-full p-3 text-black leading-tight focus:outline-none text-xs"
                />
              </div>
              <div className="flex items-center justify-end">
                <button
                  disabled={!convertedCIDs}
                  onClick={() => {
                    setModalMode("select");
                    setIsModalOpen(true);
                  }}
                  className="bg-gradient-to-br from-gray-700 to-black text-white py-2 px-4 rounded hover:opacity-80 focus:outline-none transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-75"
                >
                  Start
                </button>
              </div>
            </div>
          )}
          {viewMode === "monitor" && (
            <div className="bg-white p-6 rounded-lg shadow-xl w-96 space-y-4 max-w-xl w-full">
              <h2 className="text-lg font-bold mb-4 text-center">
                Check Job Status
              </h2>
              <div>
                <label className="block text-black text-sm font-bold mb-2">
                  Input Job ID
                </label>
                <input
                  type="text"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  className="shadow appearance-none border rounded w-full p-3 text-black leading-tight focus:outline-none text-xs"
                />
              </div>
              <div className="flex items-center justify-end">
                <button
                  disabled={!jobId}
                  onClick={() => {
                    setModalMode("job");
                    setIsModalOpen(true);
                  }}
                  className="bg-gradient-to-br from-gray-700 to-black text-white py-2 px-4 rounded hover:opacity-80 focus:outline-none transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-75"
                >
                  Start
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full relative z-10">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-0 right-0 mx-4 my-2 focus:outline-none text-2xl text-gray-800 transition-opacity hover:opacity-75"
            >
              ×
            </button>
            {modalMode === "check" && (
              <div>
                <h2 className="text-lg font-bold mb-4 text-center">
                  CID Peers
                </h2>
                <div className="mb-4">
                  <div>
                    <span className="block text-black text-sm font-bold mb-2">
                      CID v0
                    </span>
                    <p className="text-xs mb-2">{convertedCIDs?.v0}</p>
                  </div>
                  <div>
                    <span className="block text-black text-sm font-bold mb-2">
                      CID v1
                    </span>
                    <p className="text-xs mb-2">{convertedCIDs?.v1}</p>
                  </div>
                </div>
                {peerInfo && (
                  <div className="h-96 overflow-y-auto mb-4">
                    <div className="grid grid-cols-1 gap-4">
                      {peerInfo.modifiedProviders.map((result, index) => (
                        <div
                          key={index}
                          className="border p-4 rounded shadow-sm bg-gray-50"
                        >
                          <p className="text-xs mb-2">
                            <strong>Peer ID:</strong> {result.peerID}
                          </p>
                          <p className="text-xs">
                            <strong>Multiaddress:</strong> {result.Multiaddress}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-end">
                  <button
                    disabled={!convertedCIDs}
                    onClick={() => {
                      setModalMode("select");
                      setIsModalOpen(true);
                    }}
                    className="bg-gradient-to-br from-gray-700 to-black text-white py-2 px-4 rounded hover:opacity-80 focus:outline-none transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-75"
                  >
                    Backup
                  </button>
                </div>
              </div>
            )}
            {modalMode === "select" && (
              <div>
                <h2 className="text-lg font-bold mb-4 text-center">
                  Choose Storage Method
                </h2>
                <div className="mb-4">
                  <div>
                    <span className="block text-black text-sm font-bold mb-2">
                      CID v0
                    </span>
                    <p className="text-xs mb-2">{convertedCIDs?.v0}</p>
                  </div>
                  <div>
                    <span className="block text-black text-sm font-bold mb-2">
                      CID v1
                    </span>
                    <p className="text-xs mb-2">{convertedCIDs?.v1}</p>
                  </div>
                </div>
                <div className="sm:flex sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex-1 border p-4 rounded shadow-sm bg-gray-50">
                    <h3 className="text-md font-semibold mb-2 text-center">
                      NFTStorage
                    </h3>
                    <p className="text-sm text-center mb-4">
                      Recommended for most users. Easy to setup.
                    </p>
                    <button
                      disabled={!cid}
                      onClick={() => setModalMode("nftstorage")}
                      className="w-full bg-gradient-to-br from-gray-700 to-black text-white py-2 px-4 rounded hover:opacity-80 focus:outline-none transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-75"
                    >
                      Choose
                    </button>
                  </div>
                  <div className="flex-1 border p-4 rounded shadow-sm bg-gray-50">
                    <h3 className="text-md font-semibold mb-2 text-center">
                      Lighthouse
                    </h3>
                    <p className="text-sm text-center mb-4">
                      Advanced options for custom replication, repair, renewal.
                    </p>
                    <button
                      onClick={() => setModalMode("lighthouse")}
                      className="w-full bg-gradient-to-br from-gray-700 to-black text-white py-2 px-4 rounded hover:opacity-80 focus:outline-none transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-75"
                    >
                      Choose
                    </button>
                  </div>
                </div>
              </div>
            )}
            {modalMode === "nftstorage" && (
              <div>
                <h2 className="text-lg font-bold mb-4 text-center">
                  NFTStorage Backup
                </h2>
                <div className="mb-4">
                  <div>
                    <span className="block text-black text-sm font-bold mb-2">
                      CID v1
                    </span>
                    <p className="text-xs mb-2">{convertedCIDs?.v1}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-black text-sm font-bold mb-2">
                    Input NFTStorage API Key
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={nftStorageAPIKey}
                    onChange={(e) => setNftStorageAPIKey(e.target.value)}
                    className="shadow appearance-none border rounded w-full p-3 text-black leading-tight focus:outline-none text-xs"
                  />
                </div>
                <div className="flex items-center justify-end">
                  <button
                    disabled={!convertedCIDs}
                    onClick={async () => {
                      if (!convertedCIDs) {
                        return;
                      }
                      try {
                        debug.start("NFTStorage Buckup");
                        debug.log("cid", convertedCIDs.v1);
                        const client = new NFTStorage({
                          token: nftStorageAPIKey,
                        });
                        const carPath = `https://ipfs.io/ipfs/${convertedCIDs.v1}?format=car`;
                        debug.log("carPath", carPath);
                        const response = await fetch(carPath);
                        if (!response.ok) {
                          throw new Error("Failed to fetch the car data.");
                        }
                        debug.log("car data fetched");
                        const carBlob = await response.blob();
                        debug.log("start storing car data in NFTStorage");
                        await client.storeCar(carBlob);
                        debug.log("done!!");
                        await new Promise((resolve) =>
                          setTimeout(resolve, 1000),
                        );
                        setModalMode("nftstorage-confirm");
                      } catch (error: any) {
                        showToast({
                          message: "Failed NFTStorage Buckup: " + error.message,
                        });
                      } finally {
                        debug.end();
                      }
                    }}
                    className="bg-gradient-to-br from-gray-700 to-black text-white py-2 px-4 rounded hover:opacity-80 focus:outline-none transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-75"
                  >
                    Start
                  </button>
                </div>
              </div>
            )}
            {modalMode === "nftstorage-confirm" && (
              <div>
                <div className="text-center">
                  <h2 className="text-lg font-bold mb-4">
                    NFTStorage Backup Confirmed
                  </h2>
                  <img
                    src="/logo-nftstorage.svg"
                    alt="NFTStorage Logo"
                    className="mx-auto h-400 w-auto mb-4 p-12 sm:p-24"
                  />
                  <p className="mb-2">Content backed up in NFTStorage.</p>
                  {convertedCIDs && (
                    <p>
                      <a
                        href={`https://${convertedCIDs.v1}.ipfs.nftstorage.link/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Check it out
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}
            {modalMode === "lighthouse" && (
              <div>
                <h2 className="text-lg font-bold mb-4 text-center">
                  Lighthouse Backup
                </h2>
                <div className="mb-4">
                  <div>
                    <span className="block text-black text-sm font-bold mb-2">
                      CID v0
                    </span>
                    <p className="text-xs mb-2">{convertedCIDs?.v0}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-black text-sm font-bold mb-2">
                    Input Lighthouse API Key
                  </label>
                  <input
                    type="text"
                    id="lighthouse-api-key"
                    placeholder=""
                    value={lighthouseAPIKey}
                    onChange={(e) => setLighthouseAPIKey(e.target.value)}
                    className="shadow appearance-none border rounded w-full p-3 text-black leading-tight focus:outline-none text-xs"
                  />
                </div>
                <div className="mb-4 space-y-2">
                  <label className="text-black text-sm font-bold mb-2">
                    Advanced Options:
                  </label>
                  <div>
                    <input
                      type="checkbox"
                      value="replication"
                      checked={selectedOptions.includes("replication")}
                      onChange={handleCheckboxChange}
                    />
                    <label className="ml-2">Replication</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="repair"
                      checked={selectedOptions.includes("repair")}
                      onChange={handleCheckboxChange}
                    />
                    <label className="ml-2">Repair</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      value="renewal"
                      checked={selectedOptions.includes("renewal")}
                      onChange={handleCheckboxChange}
                    />
                    <label className="ml-2">Renewal</label>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-black text-sm font-bold mb-2">
                    End Date:
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={selectedOptions.length === 0}
                    className="shadow appearance-none border rounded w-full p-3 text-black leading-tight focus:outline-none text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-black text-sm font-bold mb-2">
                    Replication Target:
                  </label>
                  <input
                    type="number"
                    id="replicationTarget"
                    value={replicationTarget}
                    onChange={(e) =>
                      setReplicationTarget(Number(e.target.value))
                    }
                    disabled={selectedOptions.length === 0}
                    className="shadow appearance-none border rounded w-full p-3 text-black leading-tight focus:outline-none text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-black text-sm font-bold mb-2">
                    Epochs:
                  </label>
                  <input
                    type="number"
                    id="epochs"
                    value={epochs}
                    onChange={(e) => setEpochs(Number(e.target.value))}
                    disabled={selectedOptions.length === 0}
                    className="shadow appearance-none border rounded w-full p-3 text-black leading-tight focus:outline-none text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="flex items-center justify-end">
                  <button
                    disabled={!convertedCIDs}
                    onClick={async () => {
                      if (!convertedCIDs) {
                        throw new Error("Invalid CID");
                      }
                      debug.start("Lighthouse Backup");
                      debug.log("cid", convertedCIDs.v0);
                      let jobType;
                      switch (selectedOptions.length) {
                        case 1:
                          jobType = selectedOptions[0];
                          break;
                        case 3:
                          jobType = "all";
                          break;
                        default:
                          showToast({
                            message:
                              "Please select either a single job option or all options.",
                          });
                          return; // Exit the function if the selected options are invalid
                      }
                      const formData = new FormData();
                      formData.append("cid", convertedCIDs.v0);
                      const dateObject = new Date(endDate);
                      const timestamp = dateObject.getTime();
                      formData.append("endDate", timestamp.toString());
                      formData.append("jobType", jobType);
                      formData.append("aggregator", "lighthouse");
                      formData.append(
                        "replicationTarget",
                        replicationTarget.toString(),
                      );
                      formData.append("epochs", epochs.toString());
                      debug.start("register job");
                      try {
                        const response = await fetch(
                          process.env.NEXT_PUBLIC_SERVICE_URL +
                            "/api/register_job",
                          {
                            method: "POST",
                            body: formData,
                          },
                        );
                        if (!response.ok) {
                          const responseData = await response.json();
                          if (responseData && responseData.error) {
                            showToast({ message: responseData.error });
                          } else {
                            showToast({
                              message:
                                "An error occurred while registering the job.",
                            });
                          }
                          return;
                        }
                        debug.start("done!!");
                        setModalMode("lighthouse-confirm");
                        setJobId(convertedCIDs.v0);
                      } catch (error) {
                        console.log(error);
                        showToast({
                          message:
                            "Network error. Please try again. You must run background service at your local for demo",
                        });
                      } finally {
                        debug.end();
                      }
                    }}
                    className="bg-gradient-to-br from-gray-700 to-black text-white py-2 px-4 rounded hover:opacity-80 focus:outline-none transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:opacity-75"
                  >
                    Start
                  </button>
                </div>
              </div>
            )}
            {modalMode === "lighthouse-confirm" && (
              <div>
                <div className="text-center">
                  <h2 className="text-lg font-bold mb-4">
                    Lighthouse Backup Confirmed
                  </h2>
                  <img
                    src="/logo-lighthouse.png"
                    alt="Lighthouse Logo"
                    className="mx-auto h-400 w-auto mb-4 p-12 sm:p-24"
                  />
                  <p className="mb-2">Content backed up in Lighthouse.</p>
                  <p className="mb-4">
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-600"
                    >
                      Check it out
                    </a>
                  </p>
                  {selectedOptions.length > 0 && (
                    <>
                      <p className="mb-2">
                        Job: {selectedOptions.map((v) => v).join(", ")} created.
                      </p>
                      <p>
                        <a
                          className="text-blue-500 hover:text-blue-600 cursor-pointer"
                          onClick={() => {
                            setModalMode("job");
                          }}
                        >
                          Check it out
                        </a>
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
            {modalMode === "job" && <JobStatus jobId={jobId} />}
          </div>
        </div>
      )}
      {isDebugStarted && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex flex-col items-center justify-center z-50 p-2">
          <div className="max-w-xl w-full bg-black p-4 rounded-lg shadow-2xl break-all">
            <div className="flex justify-between items-center text-white text-sm align-left mb-2">
              {logTitle ? `Logs for ${logTitle}` : "Logs"}{" "}
              <FaSpinner className="text-white text-sm animate-spin" />
            </div>
            {logs.map((log, i) => {
              return (
                <p
                  key={`log_${i}`}
                  className="text-green-600 text-xs align-left"
                >
                  {`>> ${log}`}
                </p>
              );
            })}
          </div>
        </div>
      )}
      {toast && (
        <div
          className={`fixed top-4 right-4 w-80 bg-red-400 text-white p-4 rounded-lg shadow-2xl z-50 text-xs break-all z-100`}
        >
          {toast.message.length > 200
            ? toast.message.substring(0, 200)
            : toast.message}
        </div>
      )}
      <footer className="text-center py-4">
        <p className="text-white text-xs">
          © 2023 IPFSure. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
