# Universal Composability Specification of PoSH




This appendix provides a formal definition of the PoSH protocol in the Universal
Composability (UC) framework. We specify the ideal functionality
$\mathcal{F}_{\textsf{PoSH}}$, the real-world protocol $\Pi_{\textsf{PoSH}}$,
the simulator $\mathcal{S}$, and the environment $\mathcal{Z}$ that interacts
with the system.

Our goal is to show that the real-world execution of PoSH securely emulates the
ideal functionality in the UC sense.


### The Universal Composability Framework


The framework of Universal Composability (UC) [Canetti01] is a general-purpose model for the
analysis of cryptographic protocols. It guarantees very strong security
properties. Protocols remain secure even if arbitrarily composed with other
instances of the same or other protocols. Security is defined in the sense of
protocol emulation. Intuitively, a protocol is said to emulate another one if no
environment (observer) can distinguish the executions. Literally, the protocol
may simulate the other protocol (without having access to the code). The notion
of security is derived by implication. Assume a protocol $P_1$ is secure per
definition. If another protocol $P_2$ emulates protocol $P_1$ such that no
environment tells apart the emulation from the execution of the protocol, then
the emulated protocol $P_2$ is as secure as protocol $P_1$.


#### Ideal Functionality


An ideal functionality is a protocol in which a trusted party that can
communicate over perfectly secure channels with all protocol participants
computes the desired protocol outcome. We say that a cryptographic protocol that
cannot make use of such a trusted party fulfills an ideal functionality if the
protocol can emulate the behavior of the trusted party for honest users, and if
the view that an adversary learns by attacking the protocol is indistinguishable
from what can be computed by a simulator that only interacts with the ideal
functionality.


#### Computation Model


The computation model of universal composability is that of interactive Turing
machines that can activate each other by writing on each other's communication
tapes. An interactive Turing machine is a form of multi-tape Turing machine and
is commonly used for modelling the computational aspects of communication
networks in cryptography.


#### Communication Model


The communication model in the bare UC framework is very basic. The messages of
a sending party are handed to the adversary who can replace these messages with
messages of his own choice that are delivered to the receiving party. This is
also the Dolev–Yao threat model (based on the computational model all parties
are modeled as interactive Turing machines).

All communication models that add additional properties such as confidentiality,
authenticity, synchronization, or anonymity are modeled using their own ideal
functionality. An ideal communication functionality takes a message as input and
produces a message as output. The (more limited) powers for the adversary
$\mathcal{A}$ are modeled through the (limited) capacity of the adversary to
interact with this ideal functionality.


##### Ideal Authenticated Channel


For an optimal ideal authenticated channel, the ideal functionality
$\mathcal{F}_{\mathsf{Auth}}$ takes a message $m$ from a party with identity $P$
as input, and outputs the same message together with the identity $P$ to the
recipient and the adversary. To model the power of the adversary to delay
asynchronous communication the functionality $\mathcal{F}_{\mathsf{Auth}}$ may
first send a message to the adversary $\mathcal{A}$ and would only deliver the
message $m,P$ once it receives the command to do so as a reply.


##### Ideal Secure Channel


In an ideal secure channel, the ideal functionality $\mathcal{F}_{\mathsf{Sec}}$
only outputs the identity of the sender to both the recipient and the adversary,
while the message is only revealed to the recipient. This models the requirement
that a secure channel is both authenticated and private. To model some leakage
about the information that is being transferred, $\mathcal{F}_{\mathsf{Sec}}$
may reveal information about the message to the adversary, e.g. the length of
the message. Asynchronous communication is modeled through the same delay
mechanism as for $\mathcal{F}_{\mathsf{Auth}}$.


##### Ideal Anonymous and Pseudonymous Channels


While the technical means, and the physical assumptions behind anonymous and
pseudonymous communication are very different, the modeling of such channels
using ideal functionalities is analogous.

In an ideal anonymous channel, the ideal functionality $\mathcal{F}_{\mathsf{Anon}}$
takes a message $m$ from a party with identity $P$ as input, and outputs the
same message but without disclosing the identity $P$ to the recipient and the
adversary.

In an ideal pseudonymous channel, the participating parties first register
unique pseudonyms with the ideal functionality $\mathcal{F}_{\mathsf{Pseu}}$. To
do a transfer $\mathcal{F}_{\mathsf{Pseu}}$ takes a message $m$ and the
pseudonym $nym$ of the recipient as input. The ideal functionality looks up the
owner of the pseudonym and transfers the message $m,nym$ without revealing the
identity of the sender.


#### Impossibility Results and Setup Assumptions


There exists no bit commitment protocol that is universally composable in the
standard model of cryptography. The intuition is that in the ideal model, the
simulator has to extract the value to commit to from the input of the
environment. This would allow the receiver in the real protocol to extract the
committed value and break the security of the protocol. This impossibility
result can be applied to other functionalities.

To circumvent the above impossibility result, additional assumptions are
required. Additional setup and trust assumptions, such as the common reference
string model and the assumption of a trusted certification authority are also
modeled using ideal functionalities in UC.


### Ideal Functionality \texorpdfstring{$\mathcal{F
_{\textsf{PoSH}}$}{F-PoSH}}

The ideal functionality maintains a registry of valid sustainability proofs and
enforces uniqueness, soundness, and privacy guarantees.

*{State Variables}

$\mathcal{F}_{\textsf{PoSH}}$ maintains:


- $\mathsf{Users}$: a map of human identifiers to public keys,
- $\mathsf{MRV}$: a list of submitted MRV commitments,
- $\mathsf{Claims}$: a list of oracle-verified claims,
- $\mathsf{Registry}$: the set of valid PoSH commitments,
- $\mathsf{Revoked}$: a set of invalidated, fraudulent, or outdated proofs.


*{Initialization}

On initialization, $\mathcal{F}_{\textsf{PoSH}}$ sets all sets/maps to empty
and notifies the adversary $\mathcal{A}$.

*{Interfaces}


**Register User.**


Upon receiving $(\textsf{register}, pk, \mathsf{uniqueProof})$ from a party $U$:


1. Verify the uniqueness proof.
2. If valid, compute $\mathsf{humanId} = H(pk \parallel \mathsf{uniqueProof})$.
3. Store $(\mathsf{humanId}, pk)$ in $\mathsf{Users}$.
4. Return $(\textsf{registered}, \mathsf{humanId})$ to $U$.



**Submit MRV Event.**


Upon receiving $(\textsf{mrv_submit}, \mathsf{humanId}, E)$:


1. Compute $\mathsf{mrvHash} = H(E)$.
2. If $\mathsf{mrvHash}$ already exists, reject.
3. Store $(\mathsf{humanId}, \mathsf{mrvHash}, E)$ in $\mathsf{MRV}$.
4. Notify oracles in the ideal world.



**Oracle Claim.**


Given a valid MRV event, an ideal oracle sends:

$(\textsf{oracle_claim}, \mathsf{humanId}, \mathsf{mrvHash}, \mathsf{methodology}, \mathsf{score})$.

$\mathcal{F}_{\textsf{PoSH}}$ checks:


1. The MRV event exists.
2. The methodology and score are well-formed.


Then it stores the claim.


**Finalize PoSH Proof.**


Upon receiving $(\textsf{prove_posh}, \mathsf{humanId}, \mathsf{mrvHash})$:


1. Check the claim exists in $\mathsf{Claims}$.
2. Compute $\mathsf{RWAP} = H(\mathsf{humanId}, \mathsf{mrvHash}, \mathsf{methodology})$.
3. Store in $\mathsf{Registry}$.
4. Return $(\textsf{posh_proof}, \mathsf{RWAP})$ to $U$.



**Verify Proof.**


On query $(\textsf{verify}, \mathsf{RWAP})$:


\[
  \textsf{Return } 
  \begin{cases}
  \textsf{valid}, & \mathsf{RWAP} \in \mathsf{Registry} \land \mathsf{RWAP} \notin \mathsf{Revoked} 

  \textsf{invalid}, & \text{otherwise.}
  \end{cases}
\]



### Real-World Protocol \texorpdfstring{$\Pi_{\textsf{PoSH
}$}{Pi-PoSH}}

The real-world protocol consists of several interacting components:


- Users generating MRV evidence and running ZK circuits,
- MRV devices producing signed raw evidence,
- Oracle networks verifying MRV correctness and emitting signatures,
- Smart contracts maintaining the on-chain PoSH registry.


*{Protocol Steps}


**1. Identity Generation.**


User generates $(pk, sk)$ and produces a ZK-unique proof:


\[
  \Pi_{\textsf{unique}}(pk) \rightarrow \mathsf{uniqueProof}
\]


Then calls the smart contract to register.


**2. MRV Submission.**


User collects MRV evidence from real-world devices and submits:


\[
  \mathsf{mrvHash} = H(E)
\]


to the oracle network.


**3. Oracle Attestation.**


Oracles validate $E$, produce a signed claim:


\[
  \sigma = \mathsf{Sign}_{sk_o}(\mathsf{claim})
\]


and write to the chain.


**4. ZK Impact Proof.**


User produces:


\[
  \Pi_{\textsf{impact}}(E)
\]


and requests registry entry.


**5. Registry Entry.**


Smart contract computes:


\[
  \mathsf{RWAP} = H(\mathsf{humanId}, \mathsf{mrvHash}, \mathsf{methodology}, \sigma)
\]


and stores it.


### Simulator \texorpdfstring{$\mathcal{S
$}{S}}

To prove UC security, we construct a simulator $\mathcal{S}$ that interacts with
the ideal functionality and the environment such that the environment cannot
distinguish between ideal and real executions.

*{Capabilities of the Simulator}

The simulator:


- intercepts oracle messages,
- emulates smart contract events,
- simulates MRV and ZK proofs,
- ensures no adversary learns private data,
- extracts adversarial MRV commitments to detect forgeries.


*{Simulation Strategy}


1. **User Registration:**  
    $\mathcal{S}$ forwards $(pk, \mathsf{uniqueProof})$ to $\mathcal{F}_{\textsf{PoSH}}$.
2. **MRV Submission:**  
    $\mathcal{S}$ receives adversarial $E$ and extracts $\mathsf{mrvHash}$.
3. **Oracle Claims:**  
    $\mathcal{S}$ fabricates signatures consistent with ideal claims.
4. **RWAP Creation:**  
    Whenever the adversary attempts to create $\mathsf{RWAP}$,  
    $\mathcal{S}$ queries $\mathcal{F}_{\textsf{PoSH}}$ to validate.
5. **Verification Queries:**  
    $\mathcal{S}$ relays all $\textsf{verify}$ queries to $\mathcal{F}_{\textsf{PoSH}}$.


Thus, the simulator can replicate all adversarial views without access
to private MRV data or ZK inputs.


### Security Theorem


\begin{theorem}
Under the assumed hardness of $\mathcal{H}$, security of the digital signature
scheme $\mathcal{S}$, and zero-knowledge and soundness of the ZK systems
$\Pi_{\textsf{unique}}$ and $\Pi_{\textsf{impact}}$, the PoSH protocol
$\Pi_{\textsf{PoSH}}$ UC-emulates the ideal functionality
$\mathcal{F}_{\textsf{PoSH}}$.
\end{theorem}

\begin{proof}[Proof Sketch.]
For any real-world adversary $\mathcal{A}$ interacting with
$\Pi_{\textsf{PoSH}}$, we construct a simulator $\mathcal{S}$ such that no
environment $\mathcal{Z}$ can distinguish between the real execution and the
ideal execution.

Key points:

- ZK proofs hide MRV event details, so $\mathcal{S}$ can simulate them.
- Oracle signatures are simulated by $\mathcal{S}$ using ideal claims.
- The ideal registry ensures soundness; real and ideal behaviors agree.
- Unique human proofs prevent identity-based adversarial deviations.


Thus, $\Pi_{\textsf{PoSH}}$ UC-emulates $\mathcal{F}_{\textsf{PoSH}}$.
\end{proof}

