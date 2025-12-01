# Threat Model and Adversaries




This appendix formalizes the threat environment in which the PoSH protocol
operates. We distinguish between classes of adversaries, their capabilities,
and the security properties the protocol is designed to guarantee.


### Adversarial Goals


An adversary $\mathcal{A}$ interacting with PoSH may attempt to:


1. **Forge sustainability events:** fabricate an MRV record or alter
        measurement values to claim non-existent impact.
2. **Exploit the oracle layer:** compromise oracle keys, inject
        fraudulent claims, or censor valid submissions.
3. **Perform identity-based attacks:** create multiple identities
        (Sybil attack), impersonate legitimate users, or transfer PoSH proofs
        between identities.
4. **Break privacy guarantees:** infer sensitive behavioral or
        geolocation data from public PoSH proofs.
5. **Manipulate reputation systems:** artificially inflate sustainability
        scores through repeated, low-value events or oracle collusion.
6. **Disrupt chain-level finality:** reorder, remove, or censor proof
        registrations on-chain.



### Adversary Model


We consider the following adversary classes:


#### Class A: Local Malicious User

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



#### Class B: Compromised Oracle

Capabilities:


- emit fraudulent $\mathsf{claim}$ values,
- collude with users to create false-positive impact,
- censor legitimate MRV events.


Mitigations:

- multisignature oracle committees,
- stake-slashable oracle sets,
- duplicated data ingest from heterogenous MRV providers.



#### Class C: Global Passive Adversary

Capabilities:


- network-wide traffic surveillance,
- timing correlation between MRV events and identities,
- linking of PoSH proofs to external metadata.


Mitigations:

- ZK privacy layer for MRV,
- timing obfuscation and proof batching,
- humanId salted commitments.



#### Class D: Chain-level Adversary

Capabilities:


- reordering or censoring registry writes,
- controlling block producers for MEV-like manipulation,
- chain forks or state rewrites.


Mitigations:

- proof finality dependent on underlying L1 consensus,
- verifiable delay before reputation updates,
- hash-anchoring PoSH commitments across multiple chains.



#### Class E: Systemic Collusion Attack

Capabilities:


- coordinated manipulation between MRV, oracles, and users,
- bulk fabrication of greenwashing records,
- capture of governance around methodologies.


Mitigations:

- diversified oracle sets with rotating keys,
- open-source, auditable methodologies,
- meta-proofs that bind $\mathsf{methodologyHash}$ to published standards.



### Security Guarantees


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



### Residual Risks


Residual attack surfaces include:


- MRV corruption by physical tampering,
- black-box ML manipulation on sensors,
- oracle cartelization,
- chain-level governance capture,
- large-scale behavioral deanonymization via public metadata.


PoSH minimizes but does not eliminate these risks; further mitigation is
possible through cross-chain anchoring, multi-layer proof aggregation, and
hardware-secured MRV attestations.

