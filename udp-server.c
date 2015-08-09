#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>
#include <time.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
 
#ifndef TRUE
#define TRUE 1
#define FALSE 0
#endif
 
extern int mkaddr(void* addr, int* addrlen, char* str_addr, char* protocol);
 
#define MAXQ 4
 
static struct {
	char* index;
	int start;
	int volit;
	int current;
} quotes[] = {
	{ "DJIA", 1030330, 375 },
	{ "NASDAQ", 276175, 125 },
	{ "S&P 500", 128331, 50 },
	{ "TSE 300", 689572, 75 },
};
 
static void initialize() {
	time_t td;
	time(&td);
	srand((int)td);
	short x;
	for(x=0; x < MAXQ; ++x )
	quotes[x].current = quotes[x].start;
}
 
/*
 * Randomly change one index quotation:
 */
static void gen_quote() {
	short x = rand() % MAXQ;
	short v = quotes[x].volit;
	short h = (v / 2) - 2;
	short r = rand() % v;
	if(r < h) r = -r;
	quotes[x].current += r;
}
 
static void displayError(const char* on_what) {
	printf("%s: (%d)%s\n", on_what, errno, strerror(errno));
	exit(1);
}
 
int main(int argc,char** argv) {
	char bcbuf[512];/* Buffer and ptr */
	int z;      /* Status return code */
	struct sockaddr_in adr_srvr;/* AF_INET */
	struct sockaddr_in adr_bc;  /* AF_INET */
	static int so_broadcast = TRUE;
	static char* sv_addr = "127.0.0.:*";
	char* bc_addr = "127.255.255.2:9097";
	 
	if(argc > 2) sv_addr = argv[2];
	if(argc > 1) bc_addr = argv[1];
	 
	int len_srvr = sizeof adr_srvr;

	z = mkaddr(&adr_srvr, &len_srvr, sv_addr, "udp");
	if(z == -1) displayError("Bad server address");
	 
	int len_bc = sizeof adr_bc;
	 
	z = mkaddr(&adr_bc, &len_bc, bc_addr, "udp");
	if(z == -1) displayError("Bad broadcast address");
	 
	int s = socket(AF_INET,SOCK_DGRAM,0);
	if(s == -1) displayError("socket()");
	 
	z = setsockopt(s, SOL_SOCKET, SO_BROADCAST, &so_broadcast, sizeof so_broadcast);
	 
	if(z == -1) displayError("setsockopt(SO_BROADCAST)");

	z = bind(s, (struct sockaddr*)&adr_srvr, len_srvr);
	 
	if(z == -1) displayError("bind()");
	 
	initialize();
	 
	for(;;) {
		gen_quote();
		 
		char* bp = bcbuf;
		short i;
		for(i = 0; i < MAXQ; i++) {
			double I0 = quotes[i].start / 100.0;
			double I = quotes[i].current / 100.0;
			sprintf(bp, "%-7.7s %8.2f %+.2f\n", quotes[i].index, I, I - I0);
			bp += strlen(bp);
		}

		z = sendto(s, bcbuf, strlen(bcbuf), 0, (struct sockaddr*)&adr_bc, len_bc); 
		
		if(z == -1) displayError("sendto()");

		sleep(4);
	}
	 
	return 0;
}

