# Related Work




Although no prior work proposes a system equivalent to Proof of Sustainable
Humanity (PoSH), several research lines and existing protocols motivate and
contextualize its design. These can be grouped into three domains:
proof-of-personhood, self-sovereign identity (SSI), and blockchain-based
sustainability verification.


### Proof of Personhood and Human Uniqueness


Multiple projects aim to establish provable human uniqueness as a Sybil
resistance mechanism. Examples include World ID (Worldcoin), which relies on
privacy-preserving biometric nullifiers [worldcoinWhitepaper], and Idena,
an early PoP protocol analyzed in depth in [ohlhaver2025compressed]. Other
initiatives explore KYC-free proof-of-personhood through decentralized graphs
or attestations, such as Polkadot's Project Individuality
[polkadot2025individuality] or BrightID. These systems attempt to provide
digital human uniqueness without central authority, forming a relevant precursor
to PoSH’s identity abstraction model.


### Self-Sovereign Identity (SSI)


The principles of self-sovereign identity (SSI)—control, consent, portability,
and privacy—are discussed extensively in the literature, including systematic
reviews by Schardong and Custódio [schardong2022ssiSurvey] and Pava-Díaz
et al. [pava2024ssiBlockchain]. Threat modeling for SSI protocols is
analyzed in [pohn2024ssiThreats]. PoSH builds on these foundations while
remaining intentionally agnostic to any single identity provider: any system
capable of generating a uniqueness proof compatible with
$\mathsf{humanId} = H(\textsf{IdP.output} \parallel \textsf{salt})$ can be used.


### Blockchain-Based Sustainability and MRV


Tokenizing sustainability attributes—such as renewable energy certificates
(RECs), carbon credits, or MRV-based environmental claims—has been explored in
multiple blockchain proposals, including privacy-preserving REC trading
[energy2024recTrading], decentralized community energy markets
[fu2023recCommunity], and registry modernization efforts
[infosys2025blockchainREC,heliyon2025indonesiaREC]. However, these systems
lack any intrinsic link to human identity or personal sustainability actions.
PoSH introduces a new concept: real-world action proofs (RWAP) bound to unique
human identities, enabling sustainability to become a cryptographic primitive
in human-centered digital systems.






