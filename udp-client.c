#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>
#include <time.h>
#include <signal.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#ifndef TRUE
#define TRUE 1
#define FALSE 0
#endif

extern int mkaddr(void* addr, int* addrlen, char* str_addr, char* protocol);

static void displayError(const char* on_what) {
     fputs(strerror(errno),stderr);
     fputs(": ",stderr);
     fputs(on_what,stderr);
     fputc('\n',stderr);
     exit(1);
}

int main(int argc,char **argv) {
    int x;
    struct sockaddr_in adr;  /* AF_INET */
    char dgram[512];         /* Recv buffer */
	char* bc_addr = "127.255.255.255:9097";

    /*
     * Use a server address from the command
     * line, if one has been provided.
     * Otherwise, this program will default
     * to using the arbitrary address
     * 127.0.0.:
     */
	if(argc > 1) bc_addr = argv[1];

	int s = socket(AF_INET, SOCK_DGRAM, 0);
	if(s == -1) displayError("socket()");

	int len_inet = sizeof adr;

	int z = mkaddr(&adr, &len_inet, bc_addr, "udp");
	if(z == -1) displayError("Bad broadcast address");

    static int so_reuseaddr = TRUE;
	z = setsockopt(s, SOL_SOCKET, SO_REUSEADDR, &so_reuseaddr, sizeof so_reuseaddr);
	if(z == -1) displayError("setsockopt(SO_REUSEADDR)");

	z = bind(s, (struct sockaddr*)&adr, len_inet);
	if(z == -1) displayError("bind(2)");

	for(;;) {
		z = recvfrom(s, dgram, sizeof dgram, 0, (struct sockaddr *)&adr, &x);
		if ( z < 0 ) displayError("recvfrom(2)"); /* else err */

		fwrite(dgram,z,1,stdout);
		putchar('\n');

		fflush(stdout);
	}

	return 0;
}

