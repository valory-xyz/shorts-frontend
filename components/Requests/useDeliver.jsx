import { useEffect, useState } from 'react';
import Web3 from 'web3';

import {
  AGENT_MECH_ABI,
  DEFAULT_MECH_ADDRESS,
} from 'common-util/AbiAndAddresses';

const WEBSOCKET_PROVIDER = process.env.NEXT_PUBLIC_GNOSIS_WEB_SOCKET;
const LATEST_BLOCK_COUNT = 15000;

/**
 * hook to return the deliver data for the requested id
 */
export const useDeliver = (requestId) => {
  const [web3Ws, setWeb3Ws] = useState(null);
  const [contractWs, setContractWs] = useState(null);

  const [isLoading, setLoading] = useState(true); // loading by default
  const [events, setEvents] = useState([]); // array to store events
  const [deliverData, setDeliverData] = useState();

  // initialize web3Ws
  useEffect(() => {
    const web3Instance = new Web3(
      new Web3.providers.WebsocketProvider(WEBSOCKET_PROVIDER),
    );
    setWeb3Ws(web3Instance);
  }, []);

  // initialize contract instance
  useEffect(() => {
    if (web3Ws) {
      const contractInstance = new web3Ws.eth.Contract(
        AGENT_MECH_ABI,
        DEFAULT_MECH_ADDRESS,
      );
      setContractWs(contractInstance);
    }
  }, [web3Ws]);

  // fetch past events and subscribe to new events
  useEffect(() => {
    let eventListener;
    const otherFilter = {
      filter: {
        returnValues: { requestId },
      },
    };

    const getEvents = async () => {
      try {
        const blockNumber = await web3Ws.eth.getBlockNumber();

        const filterOption = {
          fromBlock: blockNumber - LATEST_BLOCK_COUNT,
          toBlock: 'latest',
          ...otherFilter,
        };

        const eventsResponse = await contractWs.getPastEvents(
          'Deliver',
          filterOption,
        );
        setEvents(eventsResponse);
      } catch (error) {
        console.error('Error on getting past events for `Deliver`', error);
      }

      eventListener = contractWs.events.Deliver(
        { ...otherFilter },
        (error, event) => {
          if (error) {
            console.error('Error on event', error);
          } else {
            setEvents((prevEvents) => [...prevEvents, event]);
          }
        },
      );
    };

    if (contractWs && requestId) {
      getEvents();
    }

    return () => {
      if (eventListener && typeof eventListener.unsubscribe === 'function') {
        eventListener.unsubscribe();
      }
    };
  }, [requestId, contractWs]);

  // find the deliver data for the requested id once the events are fetched
  useEffect(() => {
    const currentDeliverData = events.find(
      (event) => event.returnValues.requestId === requestId,
    );

    if (currentDeliverData) {
      setLoading(false);
      setDeliverData(currentDeliverData.returnValues);
    }
  }, [events]);

  return { isLoading, data: deliverData };
};
