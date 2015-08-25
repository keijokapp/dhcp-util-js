var createEnum = function(v, n) {
    function Enum(value, name) {
        this.value = value;
        this.name = name;
    }
    Enum.prototype.toString = function() { return this.name; };
    Enum.prototype.valueOf = function() { return this.value; };
    return Object.freeze(new Enum(v, n));
}

export var BOOTPMessageType = Object.freeze({
    BOOTPREQUEST: createEnum(1, 'BOOTPREQUEST'),
    BOOTPREPLY: createEnum(2, 'BOOTPREPLY'),
    get: function(value) {
        for(var key in this) {
            var obj = this[key];
            if (obj == value)
                return obj;
        }
        return undefined;
    }
});

// rfc1700 hardware types
export var ARPHardwareType = Object.freeze({
    HW_ETHERNET: createEnum(1, 'HW_ETHERNET'),
    HW_EXPERIMENTAL_ETHERNET: createEnum(2, 'HW_EXPERIMENTAL_ETHERNET'),
    HW_AMATEUR_RADIO_AX_25: createEnum(3, 'HW_AMATEUR_RADIO_AX_25'),
    HW_PROTEON_TOKEN_RING: createEnum(4, 'HW_PROTEON_TOKEN_RING'),
    HW_CHAOS: createEnum(5, 'HW_CHAOS'),
    HW_IEEE_802_NETWORKS: createEnum(6, 'HW_IEEE_802_NETWORKS'),
    HW_ARCNET: createEnum(7, 'HW_ARCNET'),
    HW_HYPERCHANNEL: createEnum(8, 'HW_HYPERCHANNEL'),
    HW_LANSTAR: createEnum(9, 'HW_LANSTAR'),
    get: function(value) {
        for(var key in this) {
            var obj = this[key];
            if (obj == value)
                return obj;
        }
        return undefined;
    }
});

// rfc1533 code 53 dhcpMessageType
export var DHCPMessageType = Object.freeze({
    DHCPDISCOVER: createEnum(1, 'DHCPDISCOVER'),
    DHCPOFFER: createEnum(2, 'DHCPOFFER'),
    DHCPREQUEST: createEnum(3, 'DHCPREQUEST'),
    DHCPDECLINE: createEnum(4, 'DHCPDECLINE'),
    DHCPACK: createEnum(5, 'DHCPACK'),
    DHCPNAK: createEnum(6, 'DHCPNAK'),
    DHCPRELEASE: createEnum(7, 'DHCPRELEASE'),
    get: function(value) {
        for (var key in this) {
            var obj = this[key];
            if (obj == value)
                return obj;
        }
        return undefined;
    }
})

