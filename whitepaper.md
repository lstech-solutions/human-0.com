---
title: 'HUM∧N-Ø Protocol Whitepaper: Proof of Sustainable Humanity (PoSH)'
subtitle: 'A Cryptographic Primitive for Sustainability Verification'
authors:
  - name: 'Edward Calderón et al.'
    email: 'contact@human0.me'
date: '2025-11-30'
version: '1.0.0'
keywords:
  - sustainability
  - blockchain
  - proof-of-personhood
  - zero-knowledge
bibliography: apps/docs/docs/refs.bib
---

# Proof of Sustainable Humanity (PoSH)
## Technical Whitepaper v1.0

**A Novel Cryptographic Primitive for Verifying Human-Scale Sustainability Contributions**

Authors: HUMΛN-Ø Research Team  
Date: 2025  
Status: Draft

---

### 📄 Download Official PDF

> **Science Approval & Peer Review Disclaimer**  
> This document is a draft version undergoing scientific review. For the official peer-reviewed publication and detailed technical specifications, please download the complete PDF:

[**📥 Download Official PoSH Whitepaper PDF**](/whitepaper.pdf)  
*Contains full mathematical proofs, security analysis, and implementation details*

---

  Contact: `contact@human0.me`





---



% =====================================================
% Manifesto (1-page, more technical / crypto-oriented)
% =====================================================

# Manifesto


Humanity is simultaneously running two non-linear processes: an accelerating
planetary crisis and an expanding digital infrastructure largely indifferent to
physical limits. The systems that secure our digital assets today—hashpower,
stake, and centralized identity—do not secure our future on this planet.

HUM{∧}N-Ø begins from a simple assertion: sustainability must
become a *first-class cryptographic primitive*. Our digital identities
should not only prove ownership or solvency, but also attest to our contribution
to planetary stability. We call this primitive **Proof of Sustainable
Humanity (PoSH)**.

Traditional consensus:

  - *Proof of Work* consumes energy as a Sybil-resistance mechanism;
        its security budget is paid in thermodynamic cost.
  - *Proof of Stake* concentrates control in capital and remains
        structurally agnostic to real-world emissions or ecological impact.


Neither model encodes a notion of *human-scale, positive environmental
action*. They secure ledgers; they do not secure the biosphere.

HUM{∧}N-Ø proposes a complementary axis of trust: a ledger in
which each entry corresponds to a verifiable sustainability event attributed to
a unique human. Measurement, reporting, and verification (MRV) pipelines
generate signed records of renewable energy use, low-carbon mobility, or
regenerative actions. Oracle networks transform these records into
cryptographically committed claims. Zero-knowledge proofs {cite}`GMR85` allow individuals to
demonstrate that they have performed valid actions according to public
methodologies, without exposing their raw behavioral data.

At the core of PoSH is a simple mapping:
\[
  \text{Human} \;\rightarrow\; \mathsf{humanId} \;\rightarrow\;
  {\text{impact commitments on-chain}}.
\]
Each commitment is an immutable binding between a pseudonymous human identifier
and an attested sustainability event, derived as a hash of MRV data, methodology
references, and oracle attestations. Together, these commitments form a
sustainability ledger keyed by human beings, not by accounts or corporations.

The protocol is non-extractive by design. Minting a PoSH proof must cost no more
than the underlying network fee. No central party is entitled to rent-seek on
the right of a human to demonstrate positive impact. The economic incentives are
shifted: it is rational to invest in better MRV, in higher-quality oracles, and
in more transparent methodologies, but not to charge individuals for access to
their own sustainability record.

We affirm the following:

  - Every human should be able to hold a cryptographic proof of their
        positive environmental actions.
  - These proofs must be verifiable without requiring the disclosure of
        private life details.
  - The infrastructure to mint and verify such proofs must be open,
        composable, and globally accessible.
  - No governance, market, or institution should be able to monopolize or
        censor the representation of sustainable humanity.


HUM{∧}N-Ø does not claim to solve climate change. It aims to
provide the minimal cryptographic substrate on which more honest, transparent,
and human-scale climate coordination can be built. By embedding sustainability
directly into identity and state, we align digital verification with ecological
reality.

Zero is not an absence; it is a boundary condition. Net zero is not a slogan,
but a statement that can—and must—be proven. HUM{∧}N-Ø is an
invitation to treat that proof as a public good.



---



% =====================================================
% PoSH Chapter (technical architecture)
% =====================================================

# Proof of Sustainable Humanity (PoSH)


## Introduction

The accelerating climate crisis reveals a structural gap in how digital systems
recognize, value, and verify human contributions to environmental sustainability.
Existing blockchain consensus mechanisms—such as Proof of Work (PoW) and Proof
of Stake (PoS)—are fundamentally unsuitable for representing or incentivizing
human-scale sustainable action. PoW externalizes environmental cost through
computational waste {cite}`goodell2020greenBlockchain`, while PoS concentrates power among capital-rich actors and
remains detached from real-world impact {cite}`saleh2021pos`.

**Proof of Sustainable Humanity (PoSH)** is introduced as a new primitive:
a cryptographically verifiable, privacy-preserving mechanism that represents the
positive, measurable environmental actions performed by unique human individuals.
PoSH is designed as the foundational trust layer of the HUM{∧}N-Ø
protocol, enabling transparent, decentralized verification of sustainability
actions without requiring invasive identification or resource-intensive
computation.

Prior initiatives in proof-of-personhood and decentralized identity highlight
the need for Sybil-resistant, privacy-preserving human uniqueness
{cite}`ohlhaver2025compressed,worldcoinWhitepaper,polkadot2025individuality`.
Similarly, research on self-sovereign identity (SSI) identifies long-standing
requirements for control, privacy, and interoperability
{cite}`schardong2022ssiSurvey,pava2024ssiBlockchain`. Parallel work on
blockchain-based verification of renewable energy and carbon assets demonstrates
strong demand for transparent, tamper-resistant sustainability accounting
{cite}`energy2024recTrading,fu2023recCommunity,infosys2025blockchainREC`.
Yet no system unifies these domains. PoSH proposes a synthesis: a
cryptographically sound link between human uniqueness and verifiable positive
environmental action.

\medskip
\noindent*PoSH establishes a new cryptographic primitive: a Real-World
Action Proof (RWAP), where verifiable, privacy-preserving sustainability events
performed by unique humans become first-class cryptographic commitments.*

This chapter formally defines the PoSH architecture, its components, data flows,
and security considerations.

## Design Principles

PoSH is built upon the following principles:

    - **Human-centeredness:** The unit of verification is a unique human,
    not a machine or a capital pool.
    - **Environmental positivity:** Each proof must correspond to a
    measurable positive environmental action.
    - **Non-extractiveness:** Minting a PoSH proof must require no
    protocol-level fee beyond blockchain gas costs.
    - **Privacy preservation:** Raw sustainability event data remains
    off-chain and may be wrapped in zero-knowledge proofs.
    - **Transparency and verifiability:** All claims must be backed by
    auditable, cryptographically signed MRV records.
    - **Global accessibility:** The protocol must be usable regardless
    of geographical location, financial resources, or device constraints.


## System Overview

The PoSH system is composed of three primary layers:
*Identity*, *Impact Verification*, and *On-chain Proof
Registration*. A high-level overview is illustrated in
Figure~[fig:posh-architecture].


```{mermaid}
flowchart TD
    A[Human User] --> B[HUM∧N-Ø Application]
    B --> C[MRV Adapters<br/>smart meter, I-REC, EV, ...]
    B --> D[Oracle Network]
    C --> D
    D --> E[PoSH Proof Registry<br/>on-chain]
    E --> F[PoSH Soulbound NFTs]
    E --> G[dApps, ESG Systems,<br/>Employers, Protocols]
    
    style A fill:#e1f5ff
    style E fill:#ffe1e1
    style F fill:#fff4e1
```

**Figure 1:** High-level architecture of the PoSH protocol.


## Identity Layer (Agnostic and Modular)

PoSH requires each sustainability proof to be associated with one unique human
being, but it intentionally avoids prescribing any specific identity system.
Instead, PoSH implements a modular, provider-agnostic identity architecture in
which multiple decentralized identity mechanisms can coexist, interoperate, and
be upgraded independently. The protocol receives only a pseudonymous commitment,
never personal data or biometric information.

### Unified Identity Commitment

Let $\textsf{IdP}$ denote any identity provider—such as Humanity Protocol,
World ID, Sismo, BrightID, Proof of Humanity, Gitcoin Passport, PolygonID,
Passkeys/WebAuthn, or any W3C-compatible verifiable credential system. Each
provider outputs a proof of uniqueness, membership, or personhood.

PoSH abstracts these systems under a unified commitment:

\[
\mathsf{humanId} = H(\textsf{IdP.output} \parallel \textsf{salt}) \, .
\]

This ensures unlinkability across platforms while permitting the user to switch
identity providers without invalidating past PoSH proofs.

### Supported Identity Modalities

PoSH supports diverse identity primitives, including:

  - **Zero-knowledge personhood:** World ID, Humanity Protocol,
        Semaphore/RLN, Sismo Vault proofs.
  - **Graph-based Sybil resistance:** BrightID, Circles UBI.
  - **Verifiable credentials:** PolygonID, Iden3/DID, EAS attestations.
  - **Device-bound trust:** WebAuthn/Passkeys, secure enclave
        attestations, local biometrics hashed inside the device.
  - **Hybrid multi-signal systems:** Gitcoin Passport, ENS-based
        identity bundles.


PoSH remains neutral toward all identity providers and does not require any
specific technology to dominate the identity layer.

### Identity Requirements

Each identity solution used with PoSH must satisfy:

  - **Uniqueness:** One human corresponds to one identity commitment.
  - **Sybil resistance:** Resistance must come from ZK uniqueness,
        graph proofs, device attestations, biometrics, or multi-signal
        aggregation.
  - **Privacy:** Raw identity attributes, biometrics, and credentials
        never leave the provider; only commitments or ZK proofs are used.
  - **Non-transferability:** Identity commitments cannot be reassigned
        between different human users.


### Normalization Layer

Because providers use heterogeneous proof formats, PoSH defines:

\[
\mathsf{uniqueProof} = \textsf{Normalize}(\textsf{IdP.output})
\]

which standardizes identity proofs into a format suitable for PoSH. This allows
``hot-swapping'' identity providers without affecting PoSH proofs already stored
on-chain.

### Identity in the UC Model

In the Universal Composability framework, the identity layer is captured as an
ideal functionality $\mathcal{F}_{\textsf{IdP}}$ that guarantees:

  - correctness of uniqueness proofs,
  - unlinkability across identity systems,
  - modularity and replaceability of providers,
  - protection against mass deanonymization attacks.


PoSH integrates with any $\mathcal{F}_{\textsf{IdP}}$ satisfying these
properties, making the protocol flexible, future-proof, and independent of any
single identity ecosystem.

## Impact Verification Layer (MRV $\rightarrow$ Oracle)

### Measurement, Reporting, Verification (MRV)

Each sustainability action is captured by MRV adapters connected to real-world
data sources, including:

    - smart meters and renewable energy certificates (I-RECs) {cite}`khurana2023recBlockchain`,
    - electric vehicle (EV) charging systems,
    - solar generation and community microgrids {cite}`fu2023recCommunity`,
    - low-carbon mobility data,
    - recycling and waste management attestation systems.


The MRV process produces a digitally signed report, denoted
\(\mathsf{mrvReport}\), containing:

\[
\langle \mathsf{type},\, \mathsf{quantity},\, \mathsf{unit},\, \mathsf{co2e},\,
\mathsf{timestamp},\, \mathsf{evidenceRefs} \rangle \; .
\]

### Oracle Verification Process

The Oracle Verification process in the Proof of Sustainable Humanity (PoSH) protocol is the crucial step where decentralized Oracle nodes validate the correctness of an incoming Measurable, Reportable, and Verifiable (MRV) report before an on-chain proof is registered. This process ensures that the reported sustainability action is authentic, unique, and plausible.

#### How MRV Correctness is Determined

Oracle nodes perform four specific checks to determine the correctness and integrity of the MRV report:

    - **Data Authenticity and Digital Signatures:**
    The oracle checks the MRV report's digital signature to confirm that the data originated from the expected, trusted source (e.g., a verified IoT device, certified data provider, or a secure application) and has not been tampered with. This confirms who reported the action.

    - **Absence of Double Counting:**
    The oracle verifies that the identical sustainability action has not already been reported and committed to the Proof Registry. This is a crucial Sybil resistance and integrity check, often accomplished by checking the uniqueness of the $\mathsf{mrvHash}$ or related commitment data.

    - **Consistency with External Trusted Data Sources:**
    The oracle cross-references the reported action with external, trusted data sources. This adds an independent layer of verification. For example, if a renewable energy action is reported, the oracle may check its $\mathsf{impactValue}$ against public energy grid data or meteorological reports for that region and time.

    - **Plausibility of Values:**
    The oracle assesses the logical and technical plausibility of the reported $\mathsf{impactValue}$ by comparing it to established device or regional norms. For example, a single residential solar panel claiming to generate an implausibly high amount of energy in a short period would fail this check.


#### On-Chain Claim Generation

Once all four checks are passed, the decentralized oracle network generates a canonical, signed on-chain claim that is submitted to the PoSH smart contract. This claim is created by hashing the key verified data points, which binds the proof to the human identity and the verified action:

\[
\mathsf{claim} = H(\mathsf{humanId} \parallel \mathsf{impactType} \parallel \mathsf{impactValue} \parallel \mathsf{methodologyHash} \parallel \mathsf{mrvHash})
\]

The final claim also includes the oracle's digital signature ($\sigma$) to prove its validation:

\[
\langle \mathsf{humanId}, \mathsf{mrvHash}, \mathsf{methodology}, \mathsf{score} \rangle, \quad \sigma = \mathsf{Sign}_{sk_o}(\mathsf{claim})
\]

## On-Chain Proof Registration

### Proof Registry

The *PoSH Proof Registry* contract stores canonical, deduplicated proof
records. Each record contains:

\[
\mathsf{ProofRecord} =
\langle 
\mathsf{humanId},\,
\mathsf{impactType},\,
\mathsf{impactValue},\,
\mathsf{methodologyHash},\,
\mathsf{verificationHash},\,
\mathsf{timestamp}
\rangle \; .
\]

Proofs are immutably linked to a human’s sustainability ledger.

### PoSH Soulbound Tokens

Users may optionally mint a *PoSH NFT* representing one or more proof
records. These tokens are soulbound, i.e. non-transferable, and their metadata
contains:

    - impact categories,
    - aggregated carbon-equivalent impact,
    - MRV confidence scores,
    - methodology identifiers.


Minting costs are limited strictly to blockchain network fees.

## Zero-Knowledge Privacy Layer

The PoSH protocol supports optional zero-knowledge proofs (ZKPs) to ensure
privacy while maintaining verifiability.

Two ZK circuits are defined:

    - **Identity circuit:**
    proves that the prover is a member of the human registry without revealing
    the corresponding leaf in the Merkle tree {cite}`benSasson2014zkSNARK`.

    - **Impact circuit:**
    takes raw MRV data as private input and proves correctness of
    \(\mathsf{impactValue}\) and \(\mathsf{co2e}\) without exposing raw activity.


Thus, a user can prove:
\[
\text{``I performed a valid 5 kWh renewable energy action''}
\]
without revealing meter IDs, timestamps, or location.

## Reputation and Scoring

PoSH introduces an optional reputation mechanism to aggregate sustainability
actions into a numerical score. The reputation contract implements:

\[
\mathsf{score}(h) = \sum_{i \in \mathcal{P}(h)} w_i \cdot \mathsf{impactValue}_i
\]

where \(w_i\) are methodology-dependent weights that may incorporate:

    - input source reliability,
    - carbon-equivalent reduction,
    - MRV confidence and provenance,
    - temporal decay functions.


## PoSH as a Cryptographic Primitive

### Formal Definition

Let \(\mathcal{H}\) be a collision-resistant hash function, \(\mathcal{S}\) a
secure digital signature scheme \((\textsf{KeyGen},\textsf{Sign},\textsf{Verify})\),
and \(\Pi_{\textsf{ZK}}\) a zero-knowledge proof system. Let \(\mathbb{U}\) be
the set of unique humans, \(\mathbb{A}\) the set of measurable sustainability
actions, and \(\mathbb{O}\) the set of oracle nodes.

Each human \(u \in \mathbb{U}\) has a persistent pseudonymous identifier:
\[
  \mathsf{humanId}_u = \mathcal{H}(pk_u \parallel \mathsf{uniqueProof}_u)
\]
where \(pk_u\) is a public key and \(\mathsf{uniqueProof}_u\) is a proof of
uniqueness (e.g., from a ZK-identity system).

A sustainability event is represented as:
\[
  E = \langle \mathsf{type},\; v,\; \mathsf{co2e},\; t,\; \mathsf{evidence} \rangle
\]
with quantity \(v\), carbon-equivalent \(\mathsf{co2e}\), timestamp \(t\), and
MRV evidence bundle \(\mathsf{evidence}\). The MRV commitment is:
\[
  \mathsf{mrvHash} = \mathcal{H}(E) \; .
\]

A decentralized oracle network evaluates \(\mathsf{evidence}\) and produces a
signed claim:
\[
  \mathsf{claim} = \langle \mathsf{humanId}_u,\; \mathsf{mrvHash},\;
  \mathsf{methodology},\; \mathsf{score} \rangle , \quad
  \sigma = \textsf{Sign}_{sk_o}(\mathsf{claim})
\]
for some oracle \(o \in \mathbb{O}\).

A *Real-World Action Proof* (RWAP) commitment is defined as:
\[
  \mathsf{RWAP} =
  \mathcal{H}\big(
    \mathsf{humanId}_u \parallel
    \mathsf{mrvHash} \parallel
    \mathsf{methodology} \parallel
    \sigma
  \big) \; .
\]

A PoSH proof is generated by a procedure
\(\textsf{ProvePoSH}(u,E) \rightarrow \mathsf{RWAP}\) and stored in an on-chain
registry. Verification checks (i) the uniqueness proof, (ii) oracle signature
validity, and (iii) non-duplication of \(\mathsf{RWAP}\) in the registry.

### Security Properties

We outline the core security properties of PoSH:

\paragraph{Completeness.}
If MRV data is correct, the oracle signatures are valid, and the identity proof
is correct, then a valid PoSH proof produced by an honest prover is always
accepted:
\[
  \Pr[\textsf{VerifyPoSH}(\mathsf{RWAP}) = 1] = 1 \; .
\]

\paragraph{Soundness.}
No probabilistic polynomial-time adversary can forge a PoSH proof for an action
that is not backed by valid MRV and oracle signatures:
\[
  \Pr[\mathcal{A} \text{ forges } \mathsf{RWAP}] \leq \text{negl}(\lambda) \; .
\]

\paragraph{Privacy.}
Zero-knowledge impact proofs ensure that a verifier learns only the exposed
aggregates (e.g., \(\mathsf{co2e}\), methodology) and not the raw MRV data,
under the standard zero-knowledge definition for \(\Pi_{\textsf{ZK}}\).

\paragraph{Non-transferability.}
Because \(\mathsf{humanId}_u\) is bound inside \(\mathsf{RWAP}\), PoSH proofs
are inherently soulbound; transferring them would require forging a new identity
with the same identifier, which is computationally infeasible.

\paragraph{Sybil resistance.}
Sybil attacks are mitigated via unique human proofs, rate limiting per identity,
oracle multisignature requirements, and hash-based MRV deduplication.

### Comparison with PoW, PoS, and PoA

  
  p{3cm}p{3cm}p{3cm}}
    
    Primitive | Security basis | Externality | Real-world link 
    PoW | Computational hardness | High energy cost | None 
    PoS | Capital commitment | Low direct cost | None 
    PoA | Trusted identities | Moderate | Indirect (off-chain) 
    **PoSH** | RWAP commitments | **Positive externality** | **Direct sustainability actions** 
  **Comparative view of PoSH versus classical consensus primitives.**


PoSH is the first primitive where the ``security budget'' is grounded in
positive real-world externalities (sustainable actions) rather than energy
burn or capital lock-up.

### Symbolic Protocol Flow and UC-style Model

Figure~[fig:posh-crypto-flow] illustrates the cryptographic flow of a PoSH
proof, from human action to on-chain commitment.


```{mermaid}
flowchart TD
    A[Human u<br/>pk_u, sk_u] --> B[MRV System<br/>event E]
    B --> C[Oracle Network<br/>claim, σ]
    C --> D[ZK Prover<br/>Π_impact]
    D --> E[Blockchain /<br/>PoSH Registry]
    F[Verifier / dApp] --> E
    E --> F
    
    style A fill:#e1f5ff
    style E fill:#ffe1e1
```

**Figure 2:** Cryptographic flow of a PoSH proof from MRV to on-chain RWAP.


For a UC-style abstraction, we consider an ideal functionality
\(\mathcal{F}_{\textsf{PoSH}}\) that maintains a registry of valid sustainability
commitments and enforces uniqueness and soundness properties. The environment
\(\mathcal{Z}\) interacts with honest parties and an adversary \(\mathcal{A}\),
and the real-world PoSH protocol \(\Pi_{\textsf{PoSH}}\) is required to emulate
\(\mathcal{F}_{\textsf{PoSH}}\) in the standard UC sense.


```{mermaid}
flowchart LR
    A[Environment<br/>Z] --> B[Real Protocol<br/>Π_PoSH]
    B --> C[Adversary /<br/>Simulator A]
    C --> D[Ideal Functionality<br/>F_PoSH]
    D --> A
    
    style A fill:#e1f5ff
    style D fill:#ffe1e1
```

**Figure 3:** UC-style view of the PoSH protocol and ideal functionality
           $\mathcal{F


## Conclusion

PoSH is proposed as a foundational cryptographic primitive for representing
human-scale sustainability contributions. By integrating MRV, decentralized
oracles, privacy-preserving cryptography, and transparent on-chain registries,
PoSH enables a future where positive environmental actions can be verified,
recognized, and composed into digital identity systems without compromising
individual privacy or equity.

This chapter establishes PoSH as a viable alternative consensus dimension for
sustainability-centric digital systems, offering a means for humanity to align
its digital infrastructure with planetary boundaries.

# Related Work


Although no prior work proposes a system equivalent to Proof of Sustainable
Humanity (PoSH), several research lines and existing protocols motivate and
contextualize its design. These can be grouped into three domains:
proof-of-personhood, self-sovereign identity (SSI), and blockchain-based
sustainability verification.

## Proof of Personhood and Human Uniqueness

Multiple projects aim to establish provable human uniqueness as a Sybil
resistance mechanism. Examples include World ID (Worldcoin), which relies on
privacy-preserving biometric nullifiers {cite}`worldcoinWhitepaper`, and Idena,
an early PoP protocol analyzed in depth in {cite}`ohlhaver2025compressed`. Other
initiatives explore KYC-free proof-of-personhood through decentralized graphs
or attestations, such as Polkadot's Project Individuality
{cite}`polkadot2025individuality` or BrightID. These systems attempt to provide
digital human uniqueness without central authority, forming a relevant precursor
to PoSH’s identity abstraction model.

## Self-Sovereign Identity (SSI)

The principles of self-sovereign identity (SSI)—control, consent, portability,
and privacy—are discussed extensively in the literature, including systematic
reviews by Schardong and Custódio {cite}`schardong2022ssiSurvey` and Pava-Díaz
et al. {cite}`pava2024ssiBlockchain`. Threat modeling for SSI protocols is
analyzed in {cite}`pohn2024ssiThreats`. PoSH builds on these foundations while
remaining intentionally agnostic to any single identity provider: any system
capable of generating a uniqueness proof compatible with
$\mathsf{humanId} = H(\textsf{IdP.output} \parallel \textsf{salt})$ can be used.

## Blockchain-Based Sustainability and MRV

Tokenizing sustainability attributes—such as renewable energy certificates
(RECs), carbon credits, or MRV-based environmental claims—has been explored in
multiple blockchain proposals, including privacy-preserving REC trading
{cite}`energy2024recTrading`, decentralized community energy markets
{cite}`fu2023recCommunity`, and registry modernization efforts
{cite}`infosys2025blockchainREC,heliyon2025indonesiaREC`. However, these systems
lack any intrinsic link to human identity or personal sustainability actions.
PoSH introduces a new concept: real-world action proofs (RWAP) bound to unique
human identities, enabling sustainability to become a cryptographic primitive
in human-centered digital systems.


% =====================================================
% Appendix A — Threat Model and Adversaries
% =====================================================

\appendix
# Threat Model and Adversaries


This appendix formalizes the threat environment in which the PoSH protocol
operates. We distinguish between classes of adversaries, their capabilities,
and the security properties the protocol is designed to guarantee.

## Adversarial Goals

An adversary $\mathcal{A}$ interacting with PoSH may attempt to:

  - **Forge sustainability events:** fabricate an MRV record or alter
        measurement values to claim non-existent impact.
  - **Exploit the oracle layer:** compromise oracle keys, inject
        fraudulent claims, or censor valid submissions.
  - **Perform identity-based attacks:** create multiple identities
        (Sybil attack), impersonate legitimate users, or transfer PoSH proofs
        between identities.
  - **Break privacy guarantees:** infer sensitive behavioral or
        geolocation data from public PoSH proofs.
  - **Manipulate reputation systems:** artificially inflate sustainability
        scores through repeated, low-value events or oracle collusion.
  - **Disrupt chain-level finality:** reorder, remove, or censor proof
        registrations on-chain.


## Adversary Model

We consider the following adversary classes:

### Class A: Local Malicious User
Capabilities include:

  - forging local sensor data,
  - replaying MRV events,
  - colluding with untrusted MRV sources,
  - probing the identity layer for collision vulnerabilities.


Mitigations:
  - cryptographic signatures on MRV,
  - deduplication via $\mathsf{mrvHash}$,
  - ZK-unique identity proofs,
  - time-locked and device-bound attestations.


### Class B: Compromised Oracle
Capabilities:

  - emit fraudulent $\mathsf{claim}$ values,
  - collude with users to create false-positive impact,
  - censor legitimate MRV events.


Mitigations:
  - multisignature oracle committees,
  - stake-slashable oracle sets,
  - duplicated data ingest from heterogenous MRV providers.


### Class C: Global Passive Adversary
Capabilities:

  - network-wide traffic surveillance,
  - timing correlation between MRV events and identities,
  - linking of PoSH proofs to external metadata.


Mitigations:
  - ZK privacy layer for MRV,
  - timing obfuscation and proof batching,
  - humanId salted commitments.


### Class D: Chain-level Adversary
Capabilities:

  - reordering or censoring registry writes,
  - controlling block producers for MEV-like manipulation,
  - chain forks or state rewrites.


Mitigations:
  - proof finality dependent on underlying L1 consensus,
  - verifiable delay before reputation updates,
  - hash-anchoring PoSH commitments across multiple chains.


### Class E: Systemic Collusion Attack
Capabilities:

  - coordinated manipulation between MRV, oracles, and users,
  - bulk fabrication of greenwashing records,
  - capture of governance around methodologies.


Mitigations:
  - diversified oracle sets with rotating keys,
  - open-source, auditable methodologies,
  - meta-proofs that bind $\mathsf{methodologyHash}$ to published standards.


## Security Guarantees

PoSH guarantees, under the assumed hardness of $\mathcal{H}$, $\mathcal{S}$,
and $\Pi_{\textsf{ZK}}$:

  - **Soundness:** Only valid, verified sustainability actions can be
        committed on-chain.
  - **Uniqueness:** One human $\rightarrow$ one PoSH identity.
  - **Non-transferability:** PoSH proofs cannot be reassigned.
  - **Privacy:** Raw MRV data cannot be inferred from commitments.
  - **Robustness:** The system is resilient against colluding oracles.
  - **Liveness:** Honest actions eventually register, despite adversarial
        network conditions.


## Residual Risks

Residual attack surfaces include:

  - MRV corruption by physical tampering,
  - black-box ML manipulation on sensors,
  - oracle cartelization,
  - chain-level governance capture,
  - large-scale behavioral deanonymization via public metadata.


PoSH minimizes but does not eliminate these risks; further mitigation is
possible through cross-chain anchoring, multi-layer proof aggregation, and
hardware-secured MRV attestations.

# End of Appendix A

% =====================================================
% Appendix B — Universal Composability (UC) Specification of PoSH
% =====================================================

# Universal Composability Specification of PoSH


This appendix provides a formal definition of the PoSH protocol in the Universal
Composability (UC) framework. We specify the ideal functionality
$\mathcal{F}_{\textsf{PoSH}}$, the real-world protocol $\Pi_{\textsf{PoSH}}$,
the simulator $\mathcal{S}$, and the environment $\mathcal{Z}$ that interacts
with the system.

Our goal is to show that the real-world execution of PoSH securely emulates the
ideal functionality in the UC sense.

## The Universal Composability Framework

The framework of Universal Composability (UC) {cite}`Canetti01` is a general-purpose model for the
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

### Ideal Functionality

An ideal functionality is a protocol in which a trusted party that can
communicate over perfectly secure channels with all protocol participants
computes the desired protocol outcome. We say that a cryptographic protocol that
cannot make use of such a trusted party fulfills an ideal functionality if the
protocol can emulate the behavior of the trusted party for honest users, and if
the view that an adversary learns by attacking the protocol is indistinguishable
from what can be computed by a simulator that only interacts with the ideal
functionality.

### Computation Model

The computation model of universal composability is that of interactive Turing
machines that can activate each other by writing on each other's communication
tapes. An interactive Turing machine is a form of multi-tape Turing machine and
is commonly used for modelling the computational aspects of communication
networks in cryptography.

### Communication Model

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

#### Ideal Authenticated Channel

For an optimal ideal authenticated channel, the ideal functionality
$\mathcal{F}_{\mathsf{Auth}}$ takes a message $m$ from a party with identity $P$
as input, and outputs the same message together with the identity $P$ to the
recipient and the adversary. To model the power of the adversary to delay
asynchronous communication the functionality $\mathcal{F}_{\mathsf{Auth}}$ may
first send a message to the adversary $\mathcal{A}$ and would only deliver the
message $m,P$ once it receives the command to do so as a reply.

#### Ideal Secure Channel

In an ideal secure channel, the ideal functionality $\mathcal{F}_{\mathsf{Sec}}$
only outputs the identity of the sender to both the recipient and the adversary,
while the message is only revealed to the recipient. This models the requirement
that a secure channel is both authenticated and private. To model some leakage
about the information that is being transferred, $\mathcal{F}_{\mathsf{Sec}}$
may reveal information about the message to the adversary, e.g. the length of
the message. Asynchronous communication is modeled through the same delay
mechanism as for $\mathcal{F}_{\mathsf{Auth}}$.

#### Ideal Anonymous and Pseudonymous Channels

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

### Impossibility Results and Setup Assumptions

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

## Ideal Functionality \texorpdfstring{$\mathcal{F_{\textsf{PoSH}}$}{F-PoSH}}

The ideal functionality maintains a registry of valid sustainability proofs and
enforces uniqueness, soundness, and privacy guarantees.

\subsection*{State Variables}

$\mathcal{F}_{\textsf{PoSH}}$ maintains:

  - $\mathsf{Users}$: a map of human identifiers to public keys,
  - $\mathsf{MRV}$: a list of submitted MRV commitments,
  - $\mathsf{Claims}$: a list of oracle-verified claims,
  - $\mathsf{Registry}$: the set of valid PoSH commitments,
  - $\mathsf{Revoked}$: a set of invalidated, fraudulent, or outdated proofs.


\subsection*{Initialization}

On initialization, $\mathcal{F}_{\textsf{PoSH}}$ sets all sets/maps to empty
and notifies the adversary $\mathcal{A}$.

\subsection*{Interfaces}

\paragraph{Register User.}

Upon receiving $(\textsf{register}, pk, \mathsf{uniqueProof})$ from a party $U$:

  - Verify the uniqueness proof.
  - If valid, compute $\mathsf{humanId} = H(pk \parallel \mathsf{uniqueProof})$.
  - Store $(\mathsf{humanId}, pk)$ in $\mathsf{Users}$.
  - Return $(\textsf{registered}, \mathsf{humanId})$ to $U$.


\paragraph{Submit MRV Event.}

Upon receiving $(\textsf{mrv\_submit}, \mathsf{humanId}, E)$:

  - Compute $\mathsf{mrvHash} = H(E)$.
  - If $\mathsf{mrvHash}$ already exists, reject.
  - Store $(\mathsf{humanId}, \mathsf{mrvHash}, E)$ in $\mathsf{MRV}$.
  - Notify oracles in the ideal world.


\paragraph{Oracle Claim.}

Given a valid MRV event, an ideal oracle sends:

$(\textsf{oracle\_claim}, \mathsf{humanId}, \mathsf{mrvHash}, \mathsf{methodology}, \mathsf{score})$.

$\mathcal{F}_{\textsf{PoSH}}$ checks:

  - The MRV event exists.
  - The methodology and score are well-formed.


Then it stores the claim.

\paragraph{Finalize PoSH Proof.}

Upon receiving $(\textsf{prove\_posh}, \mathsf{humanId}, \mathsf{mrvHash})$:

  - Check the claim exists in $\mathsf{Claims}$.
  - Compute $\mathsf{RWAP} = H(\mathsf{humanId}, \mathsf{mrvHash}, \mathsf{methodology})$.
  - Store in $\mathsf{Registry}$.
  - Return $(\textsf{posh\_proof}, \mathsf{RWAP})$ to $U$.


\paragraph{Verify Proof.}

On query $(\textsf{verify}, \mathsf{RWAP})$:

\[
  \textsf{Return } 
  \begin{cases}
  \textsf{valid}, | \mathsf{RWAP} \in \mathsf{Registry} \land \mathsf{RWAP} \notin \mathsf{Revoked} 
  \textsf{invalid}, | \text{otherwise.}
  \end{cases}
\]

## Real-World Protocol \texorpdfstring{$\Pi_{\textsf{PoSH}$}{Pi-PoSH}}

The real-world protocol consists of several interacting components:

  - Users generating MRV evidence and running ZK circuits,
  - MRV devices producing signed raw evidence,
  - Oracle networks verifying MRV correctness and emitting signatures,
  - Smart contracts maintaining the on-chain PoSH registry.


\subsection*{Protocol Steps}

\paragraph{1. Identity Generation.}

User generates $(pk, sk)$ and produces a ZK-unique proof:

\[
  \Pi_{\textsf{unique}}(pk) \rightarrow \mathsf{uniqueProof}
\]

Then calls the smart contract to register.

\paragraph{2. MRV Submission.}

User collects MRV evidence from real-world devices and submits:

\[
  \mathsf{mrvHash} = H(E)
\]

to the oracle network.

\paragraph{3. Oracle Attestation.}

Oracles validate $E$, produce a signed claim:

\[
  \sigma = \mathsf{Sign}_{sk_o}(\mathsf{claim})
\]

and write to the chain.

\paragraph{4. ZK Impact Proof.}

User produces:

\[
  \Pi_{\textsf{impact}}(E)
\]

and requests registry entry.

\paragraph{5. Registry Entry.}

Smart contract computes:

\[
  \mathsf{RWAP} = H(\mathsf{humanId}, \mathsf{mrvHash}, \mathsf{methodology}, \sigma)
\]

and stores it.

## Simulator \texorpdfstring{$\mathcal{S$}{S}}

To prove UC security, we construct a simulator $\mathcal{S}$ that interacts with
the ideal functionality and the environment such that the environment cannot
distinguish between ideal and real executions.

\subsection*{Capabilities of the Simulator}

The simulator:

  - intercepts oracle messages,
  - emulates smart contract events,
  - simulates MRV and ZK proofs,
  - ensures no adversary learns private data,
  - extracts adversarial MRV commitments to detect forgeries.


\subsection*{Simulation Strategy}

  - **User Registration:**  
    $\mathcal{S}$ forwards $(pk, \mathsf{uniqueProof})$ to $\mathcal{F}_{\textsf{PoSH}}$.
  - **MRV Submission:**  
    $\mathcal{S}$ receives adversarial $E$ and extracts $\mathsf{mrvHash}$.
  - **Oracle Claims:**  
    $\mathcal{S}$ fabricates signatures consistent with ideal claims.
  - **RWAP Creation:**  
    Whenever the adversary attempts to create $\mathsf{RWAP}$,  
    $\mathcal{S}$ queries $\mathcal{F}_{\textsf{PoSH}}$ to validate.
  - **Verification Queries:**  
    $\mathcal{S}$ relays all $\textsf{verify}$ queries to $\mathcal{F}_{\textsf{PoSH}}$.


Thus, the simulator can replicate all adversarial views without access
to private MRV data or ZK inputs.

## Security Theorem

:::{admonition} Theorem
:class: important

Under the assumed hardness of $\mathcal{H}$, security of the digital signature
scheme $\mathcal{S}$, and zero-knowledge and soundness of the ZK systems
$\Pi_{\textsf{unique}}$ and $\Pi_{\textsf{impact}}$, the PoSH protocol
$\Pi_{\textsf{PoSH}}$ UC-emulates the ideal functionality
$\mathcal{F}_{\textsf{PoSH}}$.
:::

:::{admonition} Proof
:class: note

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
:::

# End of Appendix B






## References

See bibliography file: `refs.bib`




