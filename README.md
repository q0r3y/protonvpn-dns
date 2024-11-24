You can read more in this blogpost:
https://corey.sh/blogs/2024/11/17/protonvpn-dns-pool-removal.html

"ProtonVPN recently announced they are decommissioning the legacy DNS entries for country-based IP pools like “us.protonvpn.net” which are used in older OpenVPN configuration profiles. If you’re using a newer profile, you’re likely using a fixed IP address instead, so this may not apply to you.

This change creates an issue for my setup. I use ProtonVPN with OpenVPN on my pfSense firewall, where I have a cron job that restarts the OpenVPN service according to the schedule I set. The cron job ensures that I get a new random IP address from ProtonVPN’s DNS pool each time the service restarts. However, with the removal of the legacy DNS pools, this option is no longer available.

ProtonVPN recommends switching to WireGuard, which offers better performance, security, and a more efficient codebase. However, the same issue persists with WireGuard: since your private key is tied to a specific ProtonVPN server, you won’t have the option to randomly rotate IPs. Instead, you’ll need to configure multiple tunnels in pfSense and switch between them manually.
The Solution

To solve this problem, I’ve developed a simple solution for OpenVPN users relying on ProtonVPN’s DNS pools. I’ve created a Cloudflare Worker that is scheduled to run every minute, fetching a random row from a D1 SQL database and updating the “us.protonvpn” A record at corey.sh with the corresponding IP address. Currently, the IP addresses in the D1 database are manually populated using a script that queries Proton’s API and extracts the node IPs. In the near future, I plan to automate this process with an additional worker, ensuring that the database always contains up-to-date node information. This allows me to continue rotating IP addresses without disruption."
